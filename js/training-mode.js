function TrainingMode() {
	this.duration = 365; // in days
	this.tooltipClass = 'blue_tooltip';

	if (this.isOff()) {
		$('.' + this.tooltipClass).remove();
	}
}

TrainingMode.prototype.isOff = function () {
	return Cookies.get('training_mode_off') !== undefined;
};

TrainingMode.prototype.on = function () {
	Cookies.remove('training_mode_off');
	window.location.reload();
};

TrainingMode.prototype.off = function () {
	Cookies.set('training_mode_off', 1, {expires: this.duration});
	window.location.reload();
};
