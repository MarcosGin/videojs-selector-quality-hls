import videojs from "video.js";
import _each from "lodash/each";

// Concrete classes
const VideojsMenuItem = videojs.getComponent("MenuItem");

/**
 * Extend vjs menu item class.
 */
export default class MenuItem extends VideojsMenuItem {
  /**
   * Menu item constructor.
   *
   * @param {Player} player - vjs player
   * @param {Object} item - Item object
   * @param {Button} qualityButton - The containing button.
   * @param {SelectorQuality} plugin - This plugin instance.
   */
  constructor(player, item, qualityButton, plugin) {
    super(player, {
      label: item.label,
      selectable: true,
      selected: item.selected || false
    });
    this.item = item;
    this.qualityButton = qualityButton;
    this.plugin = plugin;
  }

  /**
   * Click event for menu item.
   */
  handleClick() {
    // Reset other menu items selected status.
    _each(this.qualityButton.items, (item, key) => {
      item.selected(false);
    });

    // Set this menu item to selected, and set quality.
    this.plugin.setQuality(this.item.value);
    this.selected(true);
  }
}
