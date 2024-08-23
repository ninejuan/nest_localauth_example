export function checkXSS(str: string) {
    const res = str
        .replaceAll("onafterprint", "<REDACTED>")
        .replaceAll("onkeydown", "<REDACTED>")
        .replaceAll("onclick", "<REDACTED>")
        .replaceAll("ondblclick", "<REDACTED>")
        .replaceAll("onmouse", "<REDACTED>")
        .replaceAll("ondrag", "<REDACTED>")
        .replaceAll("onerror", "<REDACTED>")
        .replaceAll("onabort", "<REDACTED>")
        .replaceAll("onplay", "<REDACTED>")
        .replaceAll("<", "<REDACTED>")
        .replaceAll(">", "<REDACTED>")
    return res;
}