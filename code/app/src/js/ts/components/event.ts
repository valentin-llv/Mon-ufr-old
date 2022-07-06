"use strict"

export default function ClassEvent(props): any {
    return {
        $template: "#class-template",
        event: props.event,
    };
}