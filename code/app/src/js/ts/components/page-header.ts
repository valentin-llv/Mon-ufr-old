"use strict"

// Component

export default function PageHeader(props) {
    return {
        $template: "#page-header-template",

        pageTitle: props.pageTitle,
    }
}