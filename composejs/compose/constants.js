const Justify = {
    End: { marginLeft: "auto" },
    Start: { marginRight: "auto" },
    CenterHorizontal: { marginLeft: "auto", marginRight: "auto" },
    CenterVertical: { marginTop: "auto", marginBottom: "auto" },
    Center: { marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto" },
    Bottom: { marginTop: "auto" },
    Top: { marginBottom: "auto" },
    BottomEnd: { marginTop: "auto", marginLeft: "auto" },
    TopEnd: { marginBottom: "auto", marginRight: "auto" },
    BottomStart: { marginTop: "auto", marginRight: "auto" },
    TopStart: { marginBottom: "auto", marginLeft: "auto" }
}

const JustifyContent = {
    Start: { justifyContent: "flex-start" },
    End: { justifyContent: "flex-end" },
    Center: { justifyContent: "center" },
    SpaceBetween: { justifyContent: "space-between" },
    SpaceAround: { justifyContent: "space-around" },
    SpaceEvenly: { justifyContent: "space-evenly" }
}

const Align = {
    End: { alignItems: "flex-end" },
    Start: { alignItems: "flex-start" },
    Center: { alignItems: "center" },
    Baseline: { alignItems: "baseline" },
    Default: { alignItems: "stretch" },
    Initial: { alignItems: "initial" },
    Inherit: { alignItems: "inherit" }
}

const TextAlign = {
    Start: { textAlign: "left" },
    End: { textAlign: "right" },
    Center: { textAlign: "center" },
    Justify: { textAlign: "justify" },
    Initial: { textAlign: "initial" },
    Inherit: { textAlign: "inherit" }
}

const FabPosition = {
    Start: { top: "24px", left: "24px" },
    End: { top: "24px", right: "24px" },
    Center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    BottomStart: { bottom: "24px", left: "24px" },
    BottomEnd: { bottom: "24px", right: "24px" },
    BottomCenter: { bottom: "24px", left: "50%", transform: "translate(-50%, 0)" },
    TopCenter: { top: "24px", left: "50%", transform: "translate(-50%, 0)" },
    StartCenter: { top: "50%", left: "24px", transform: "translate(0, -50%)" },
    EndCenter: { top: "50%", right: "24px", transform: "translate(0, -50%)" }
}


const Overflow = {
    Hidden: { overflow: "hidden" },
    Scroll: { overflow: "scroll" },
    Auto: { overflow: "auto" },
    Visible: { overflow: "visible" },
    ScrollX: { overflowX: "scroll" },
    ScrollY: { overflowY: "scroll" },
    AutoX: { overflowX: "auto" },
    AutoY: { overflowY: "auto" },
    VisibleX: { overflowX: "visible" },
    VisibleY: { overflowY: "visible" },
    HiddenX: { overflowX: "hidden" },
    HiddenY: { overflowY: "hidden" }
}


const Duration = {
    Short: 0,
    Long: 1,
    Indefinite: 2
}

const Unit = {
    
}


const Visibility = {
    Visible: { visibility: "visible" },
    Hidden: { visibility: "hidden" },
    Collapse: { visibility: "collapse" }
}

const Display = {
    Inline: { display: "inline" },
    Block: { display: "block" },
    Contents: { display: "contents" },
    Flex: { display: "flex" },
    Grid: { display: "grid" },
    InlineBlock: { display: "inline-block" },
    InlineFlex: { display: "inline-flex" },
    InlineGrid: { display: "inline-grid" },
    InlineTable: { display: "inline-table" },
    ListItem: { display: "list-item" },
    RunIn: { display: "run-in" },
    Table: { display: "table" },
    TableCaption: { display: "table-caption" },
    TableColumnGroup: { display: "table-column-group" },
    TableHeaderGroup: { display: "table-header-group" },
    TableFooterGroup: { display: "table-footer-group" },
    TableRowGroup: { display: "table-row-group" },
    TableCell: { display: "table-cell" },
    TableColumn: { display: "table-column" },
    TableRow: { display: "table-row" },
    None: { display: "none" },
    Initial: { display: "initial" },
    Inherit: { display: "inherit" }
}


const FontWeight = {
    Normal: { fontWeight: "normal" },
    Bold: { fontWeight: "bold" },
    Bolder: { fontWeight: "bolder" },
    Lighter: { fontWeight: "lighter" },
    Initial: { fontWeight: "initial" },
    Inherit: { fontWeight: "inherit" }
}


export {
    Justify,
    JustifyContent,
    FabPosition,
    Overflow,
    Duration,
    Unit,
    Visibility,
    Display,
    Align,
    TextAlign,
    FontWeight
}

