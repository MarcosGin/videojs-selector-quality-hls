import videojs from "video.js";

const VideojsMenuButton = videojs.getComponent("MenuButton");
const VideojsMenu = videojs.getComponent("Menu");
const VideojsComponent = videojs.getComponent("Component");
const Dom = videojs.dom;

/**
 * Convert string to title case.
 *
 * @param {string} string - the string to convert
 * @return {string} the returned titlecase string
 */
function toTitleCase(string) {
  if (typeof string !== "string") {
    return string;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Extend vjs button class for quality button.
 */
export default class Button extends VideojsMenuButton {
  /**
   * Button constructor.
   *
   * @param {Player} player - videojs player instance
   */
  constructor(player, { options }) {
    super(player, { title: player.localize("Quality") });

    const { plugin, buttonIcon } = options.classNames;

    //Change icon, maybe get from options.
    this.menuButton_.$(".vjs-icon-placeholder").className += ` ${buttonIcon}`;

    // Add classname from options plugin.
    this.addClass(plugin);

    //Show the button
    this.removeClass("vjs-hidden");
  }

  /**
   * Creates button items.
   *
   * @return {Array} - Button items
   */
  createItems() {
    return [];
  }

  /**
   * Create the menu and add all items to it.
   *
   * @return {Menu}
   *         The constructed menu
   */
  createMenu() {
    const menu = new VideojsMenu(this.player_, { menuButton: this });

    this.hideThreshold_ = 0;

    if (this.options_.title) {
      const titleEl = Dom.createEl("li", {
        className: "vjs-menu-title",
        innerHTML: toTitleCase(this.options_.title),
        tabIndex: -1
      });
      const titleComponent = new VideojsComponent(this.player_, {
        el: titleEl
      });

      this.hideThreshold_ += 1;

      menu.addItem(titleComponent);
    }

    this.items = this.createItems();

    if (this.items) {
      for (let i = 0; i < this.items.length; i++) {
        menu.addItem(this.items[i]);
      }
    }

    return menu;
  }
}
