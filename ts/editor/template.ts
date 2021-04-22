// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
import type DropdownMenu from "editor-toolbar/DropdownMenu.svelte";
import type { DropdownMenuProps } from "editor-toolbar/DropdownMenu";
import type ButtonGroup from "editor-toolbar/ButtonGroup.svelte";
import type { ButtonGroupProps } from "editor-toolbar/ButtonGroup";
import type { DynamicSvelteComponent } from "sveltelib/dynamicComponent";

import { bridgeCommand } from "anki/bridgecommand";
import {
    iconButton,
    withDropdownMenu,
    dropdownMenu,
    dropdownItem,
    buttonGroup,
    withShortcuts,
} from "editor-toolbar/dynamicComponents";
import * as tr from "anki/i18n";

import { wrap } from "./wrap";

import paperclipIcon from "./paperclip.svg";
import micIcon from "./mic.svg";
import functionIcon from "./function-variant.svg";
import xmlIcon from "./xml.svg";

import { getClozeButton } from "./cloze";

function onAttachment(): void {
    bridgeCommand("attach");
}

function onRecord(): void {
    bridgeCommand("record");
}

function onHtmlEdit(): void {
    bridgeCommand("htmlEdit");
}

const mathjaxMenuId = "mathjaxMenu";

export function getTemplateGroup(): DynamicSvelteComponent<typeof ButtonGroup> &
    ButtonGroupProps {
    const attachmentButton = withShortcuts({
        shortcuts: ["F3"],
        button: iconButton({
            icon: paperclipIcon,
            onClick: onAttachment,
            tooltip: tr.editingAttachPicturesaudiovideo(),
        }),
    });

    const recordButton = withShortcuts({
        shortcuts: ["F5"],
        button: iconButton({
            icon: micIcon,
            onClick: onRecord,
            tooltip: tr.editingRecordAudio(),
        }),
    });

    const mathjaxButton = iconButton({
        icon: functionIcon,
    });

    const mathjaxButtonWithMenu = withDropdownMenu({
        button: mathjaxButton,
        menuId: mathjaxMenuId,
    });

    const htmlButton = withShortcuts({
        shortcuts: ["Control+Shift+KeyX"],
        button: iconButton({
            icon: xmlIcon,
            onClick: onHtmlEdit,
            tooltip: tr.editingHtmlEditor(),
        }),
    });

    return buttonGroup({
        id: "template",
        buttons: [
            attachmentButton,
            recordButton,
            getClozeButton(),
            mathjaxButtonWithMenu,
            htmlButton,
        ],
    });
}

export function getTemplateMenus(): (DynamicSvelteComponent<typeof DropdownMenu> &
    DropdownMenuProps)[] {
    const mathjaxMenuItems = [
        withShortcuts({
            shortcuts: ["Control+KeyM, KeyM"],
            button: dropdownItem({
                onClick: () => wrap("\\(", "\\)"),
                label: tr.editingMathjaxInline(),
            }),
        }),
        withShortcuts({
            shortcuts: ["Control+KeyM, KeyE"],
            button: dropdownItem({
                onClick: () => wrap("\\[", "\\]"),
                label: tr.editingMathjaxBlock(),
            }),
        }),
        withShortcuts({
            shortcuts: ["Control+KeyM, KeyC"],
            button: dropdownItem({
                onClick: () => wrap("\\(\\ce{", "}\\)"),
                label: tr.editingMathjaxChemistry(),
            }),
        }),
    ];

    const latexMenuItems = [
        withShortcuts({
            shortcuts: ["Control+KeyT, KeyT"],
            button: dropdownItem({
                onClick: () => wrap("[latex]", "[/latex]"),
                label: tr.editingLatex(),
            }),
        }),
        withShortcuts({
            shortcuts: ["Control+KeyT, KeyE"],
            button: dropdownItem({
                onClick: () => wrap("[$]", "[/$]"),
                label: tr.editingLatexEquation(),
            }),
        }),
        withShortcuts({
            shortcuts: ["Control+KeyT, KeyM"],
            button: dropdownItem({
                onClick: () => wrap("[$$]", "[/$$]"),
                label: tr.editingLatexMathEnv(),
            }),
        }),
    ];

    const mathjaxMenu = dropdownMenu({
        id: mathjaxMenuId,
        menuItems: [...mathjaxMenuItems, ...latexMenuItems],
    });

    return [mathjaxMenu];
}
