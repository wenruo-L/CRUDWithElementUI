export default function () {
    return {
        methods: {
            handleFocus(event) {
                console.log('handleFocus', event);
            },
            handleBlur(event) {
                console.log('handleBlur', event);
            },
            handleClick(event) {
                console.log('handleClick', event);
            },
            handleChange(value, column) {
                console.log('handleChange', value);
                console.log('column', column.label);
            },
        }
    };
}