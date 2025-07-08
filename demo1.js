let lineColor = null;
if (node?.calculateSubResult) {
  lineColor = node?.calculateSubResult[link.target_slot] ? HIGH_LIGHT_COLOR : null;
} else if (node?.calculateResult) {
  lineColor = HIGH_LIGHT_COLOR;
}

this.renderLink(ctx, start_node_slotpos, end_node_slotpos, link, false, 0, lineColor, start_dir, end_dir);