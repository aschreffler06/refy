export class MathUtils {
    static sum(numbers) {
        return numbers.reduce((a, b) => a + b, 0);
    }
    static clamp(input, min, max) {
        return Math.min(Math.max(input, min), max);
    }
    static range(start, size) {
        return [...Array(size).keys()].map(i => i + start);
    }
    static ceilToMultiple(input, multiple) {
        return Math.ceil(input / multiple) * multiple;
    }
}
//# sourceMappingURL=math-utils.js.map