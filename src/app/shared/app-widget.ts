export class AppWidget {
    public name: string
    public color: {
        bg?: string,
        border?: string,
        text?: string
    }
    public img: string
    public location: string
    constructor(name: string, img = '', location: string, color = {bg: '#ffffff', border: 'gray', text: 'gray'}) {
        this.name = name
        this.img = img
        this.location = location
        this.color = color
    }
}
