function solution(io: NodeIO): void {
    function padding(n: number) {
        return (n < 10 ? "0" : "") + n;
    }
    var now = new Date();
    var tz = now.getTime() + now.getTimezoneOffset() * 60000 + 0 * 3600000;
    now.setTime(tz);
    io.write(padding(now.getFullYear()));
    io.write(padding(now.getMonth() + 1));
    io.write(padding(now.getDate()));
}
//
// 입출력 객체
class NodeIO {
    private debug: boolean = process.argv.includes("readFromInputFile");
    private buffer: Buffer = require("fs").readFileSync(this.debug ? "./src/stdin" : 0);
    private stdout: any[] = [];
    private cursor: number = 0;
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
    public readLine(): string {
        const { buffer } = this;
        this.consumeWhiteSpace();
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
