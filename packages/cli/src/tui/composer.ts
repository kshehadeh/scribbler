type InputText = string | undefined;

/**
 * Build markdown strings using a fluent interface.  For example:
 * ```
 * const markdownText = build()
 *      .h1('My Title')
 *      .p('This is a paragraph')
 *      .list([
 *          build().listItem('Item 1'),
 *          build().listItem('Item 2'),
 *          build().listItem('Item 3'),
 *      ])
 *      .render();
 *  ```
 * 
 * The above would produce:
 * ```
 * # My Title
 * 
 * This is a paragraph
 * 
 * * Item 1
 * * Item 2
 * * Item 3
 * ```
 */
export class Composer {
    private parts: string[] = [];

    constructor(start: Composer | string = '') {
        if (start instanceof Composer) {
            this.parts = start.parts;
        } else {
            this.parts = [start];
        }
    }

    // no-dd-sa
    h1(text: InputText) {
        return this.add(`# ${text}`);
    }

    // no-dd-sa
    h2(text: InputText) {
        return this.add(`## ${text}`);
    }

    // no-dd-sa
    h3(text: InputText) {
        return this.add(`### ${text}`);
    }

    // no-dd-sa
    h4(text: InputText) {
        return this.add(`#### ${text}`);
    }

    // no-dd-sa
    h5(text: InputText) {
        return this.add(`##### ${text}`);
    }

    // no-dd-sa
    h6(text: InputText) {
        return this.add(`###### ${text}`);
    }

    list(composer: Composer[], options: { emptyMessage?: string } = {}) {
        if (composer.length === 0) {
            return this.add(options.emptyMessage || '');
        }

        return this.add(composer.map(c => c.render()).join('\n'));
    }

    p(text: InputText) {
        return this.add(text);
    }

    code(text: InputText) {
        return this.add(`\`\`\`${text}\`\`\``);
    }

    blockquote(text: InputText) {
        return this.add(`> ${text}`);
    }

    listItem(text: InputText) {
        return this.add(`* ${text}`);
    }

    private add(text: InputText): Composer {
        if (!text) {
            return this;
        }

        this.parts.push(text);

        return this;
    }

    append(composer: Composer) {
        return this.add(composer.parts.join('\n'));
    }

    render(data?: Record<string, unknown>) {
        return this.tpl(this.parts.join('\n'), data);
    }

    toString() {
        return this.render();
    }

    private tpl(text: string, data?: Record<string, unknown>) {
        if (!data) {
            return text;
        }

        return text.replace(/\${(\w+)}/g, (_, key) => {
            return data[key] as string;
        });
    }
}

export function build(optionalStartString?: string) {
    return new Composer(optionalStartString);
}
