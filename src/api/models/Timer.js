export class Timer {
  constructor(name, duration, category) {
    this.id = Date.now().toString();
    this.name = name;
    this.duration = duration;
    this.category = category;
    this.remainingTime = duration;
    this.status = 'paused';
  }
}
