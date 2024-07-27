export const parseFloatFromMessage = (message: string) => {
    const sanitizedMessage = message.replace(',', '.');
    
    const match = sanitizedMessage.match(/-?\d+(\.\d+)?/);
    if (match) {
        return parseFloat(match[0]);
    } else {
        return 0;
    }
}
