function solution(io: NodeIO): void {
    const [N, K] = makeArray(2, io.readInt);
    //
    // 1부터 n까지 이어적었을 때의 길이
    function getLength(n: number): number {
        let currentEachLength = 1;
        let inclusiveLast = 9;
        let totalLength = 0;
        while (0 < n) {
            const thisGroupCnt = n <= inclusiveLast ? n : inclusiveLast;
            const thisGroupLen = thisGroupCnt * currentEachLength;
            totalLength += thisGroupLen;
            n -= thisGroupCnt;
            inclusiveLast *= 10;
            currentEachLength++;
        }
        return totalLength;
    }
    //
    // 길이가 부족한 경우.
    if (getLength(N) < K) {
        io.write("-1");
        return;
    }
    //
    // 1부터 n까지 이어적었을 때,
    // 그 길이가 K보다 작거나 같을 때 true.
    function test(n: number): boolean {
        return getLength(n - 1) + 1 <= K;
    }
    //
    // 이분탐색
    let srt = 1;
    let end = N + 1;
    let ans = 1;
    while (srt < end) {
        const mid = (srt + end) >> 1;
        if (test(mid)) {
            ans = mid;
            srt = mid + 1;
        } else {
            end = mid;
        }
    }
    //
    // ans의 idx번째 요소를 출력한다.
    const idx = Math.max(0, K - getLength(ans - 1) - 1);
    io.write(ans.toString()[idx]);
}
//
// 입출력 객체
class NodeIO {
    private debug: boolean = process.argv.includes("readFromInputFile");
    private buffer: Buffer = require("fs").readFileSync(this.debug ? "./src/stdin" : 0);
    private stdout: any[] = [];
    private cursor: number = 0;
    constructor() {
        this.consumeWhiteSpace = this.consumeWhiteSpace.bind(this);
        this.readInt = this.readInt.bind(this);
        this.readLine = this.readLine.bind(this);
        this.readWord = this.readWord.bind(this);
        this.write = this.write.bind(this);
        this.flush = this.flush.bind(this);
    }
    /**
     * 공백이 아닌 문자를 만날 때 까지 전진한다.
     */
    private consumeWhiteSpace(): void {
        const { buffer } = this;
        while (true) {
            const char = buffer[this.cursor];
            if (char === 10 || char === 13 || char === 32) ++this.cursor;
            else break;
        }
    }
    /**
     * 소수점 없는 부호화된 정수 하나를 읽는다.
     */
    public readInt(): number {
        const { buffer } = this;
        this.consumeWhiteSpace();
        const isNegative = buffer[this.cursor] === 45;
        if (isNegative) ++this.cursor;
        let num = 0;
        while (true) {
            const char = buffer[this.cursor];
            if (48 <= char && char <= 57) {
                num = num * 10 + char - 48;
                ++this.cursor;
            } else break;
        }
        return isNegative ? -num : num;
    }
    /**
     * 단어 하나를 읽는다.
     */
    public readWord(): string {
        const { buffer } = this;
        this.consumeWhiteSpace();
        const srt = this.cursor;
        while (true) {
            const char = buffer[this.cursor];
            if (char === 10 || char === 13 || char === 32 || char === undefined) break;
            else ++this.cursor;
        }
        return this.buffer.slice(srt, this.cursor).toString("utf8");
    }
    /**
     * 라인 하나를 읽는다.
     */
    public readLine(consumeWhiteSpace = true): string {
        const { buffer } = this;
        if (consumeWhiteSpace) this.consumeWhiteSpace();
        const srt = this.cursor;
        while (true) {
            const char = buffer[this.cursor];
            if (char === 10 || char === 13 || char === undefined) break;
            else ++this.cursor;
        }
        return this.buffer.slice(srt, this.cursor).toString("utf8");
    }
    /**
     * 메세지를 콘솔에 적는다.
     * 채점 모드에서는 메세지를 버퍼에 삽입한다.
     */
    public write(message: any): void {
        if (this.debug) {
            console.log(message);
        } else {
            this.stdout.push(message);
        }
    }
    /**
     * 버퍼에 삽입된 메세지를 한꺼번에 출력하고, 프로그램을 종료한다.
     */
    public flush(): void {
        if (this.debug) {
            //
        } else {
            console.log(this.stdout.join("\n"));
            process.exit(0);
        }
    }
}
const nodeIO = new NodeIO();
solution(nodeIO);
nodeIO.flush();
//
// utils
interface makeArray {
    (sizer: number): number[];
    (sizer: () => number): number[];
    <T>(sizer: number, initializer: (idx: number) => T): T[];
    <T>(sizer: () => number, initializer: (idx: number) => T): T[];
}
function makeArray<T = number>(
    sizer: (() => number) | number,
    initializer?: (idx: number) => T,
): T[] {
    const size = typeof sizer === "function" ? sizer() : sizer;
    const array: any[] = [];
    for (let i = 0; i < size; i++) {
        array.push(initializer ? initializer(i) : i);
    }
    return array;
}
