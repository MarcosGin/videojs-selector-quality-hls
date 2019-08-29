import videojs from "video.js";
import { version as VERSION } from "../package.json";
import _find from "lodash/find";
import _orderBy from "lodash/orderBy";
import _map from "lodash/map";
//Components
import Button from "./components/Button";
import MenuItem from "./components/MenuItem";

const Plugin = videojs.getPlugin("plugin");

// Default options for the plugin.
const defaults = {
  classNames: {
    plugin: "vjs-selector-quality",
    hdQuality: "vjs-selected-hd",
    buttonIcon: "vjs-icon-cog",
    menuItemHd: "vjs-menu-item-hd"
  }
};

class SelectorQuality extends Plugin {
  /**
   * Create a SelectorQuality plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass(this.options.classNames.plugin);

      // Check if exist the qualityLevels plugin and if the video is HLS
      if (this.player.qualityLevels && this.isTechHls()) {
        // Create the quality button.
        this.createButton();

        // Bind events loadedmetada(Player) , addqualitylevel and change (Plugin)
        this.bindQualityLevelEvents();
      }
    });
  }

  /**
   * Returns HLS Plugin
   * @return {*} - videojs/http-streaming plugin.
   */
  isTechHls() {
    return this.player.tech({ IWillNotUseThisInPlugins: true }).hls;
  }
  /**
   * Add the button to the player control bar.
   */
  createButton() {
    this._button = new Button(this.player, this);

    //Todo: Set placement Index?
    const placementIndex = this.player.controlBar.children().length - 2;
    this.player.controlBar.addChild(
      this._button,
      { componentClass: "selectorQuality" },
      placementIndex
    );
  }

  /**
   * Build a menu item
   */
  buildMenuItem(item) {
    return new MenuItem(this.player, item, this._button, this);
  }

  bindQualityLevelEvents() {
    this.player
      .qualityLevels()
      .on("addqualitylevel", this.onAddQualityLevel.bind(this));

    this.player
      .qualityLevels()
      .on("change", this.onChangeQualityLevel.bind(this));

    this.player.on("loadedmetadata", this.onLoadedMetaData.bind(this));
    this.player.on("emptied", this.onReload.bind(this));
  }

  onAddQualityLevel({ qualityLevel }) {
    const checkAlreadyQuality = _find(this.state.qualityList, {
      value: qualityLevel.height
    });

    if (checkAlreadyQuality) return false;

    const newQuality = {
      label: `${qualityLevel.height} p`,
      value: qualityLevel.height
    };

    this.setState({ qualityList: [...this.state.qualityList, ...newQuality] });
  }

  onChangeQualityLevel({ selectedIndex }) {
    //Get current quality selected
    const qualitySelected = this.state.qualityList[selectedIndex];
    const { hdQuality } = this.options.classNames;

    // Check if the resolution is a HD Quality
    if (qualitySelected && qualitySelected.value >= 720) {
      this._button.addClass(hdQuality);
    } else {
      this._button.removeClass(hdQuality);
    }
  }

  onLoadedMetaData(event) {
    const { menuItemHd } = this.options.classNames;
    let qualityList = _orderBy(this.state.qualityList, ["value"], ["desc"]);

    let itemLevel;
    qualityList = _map(qualityList, quality => {
      itemLevel = this.buildMenuItem(quality);
      if (itemLevel.item.value >= 720) itemLevel.addClass(menuItemHd);
      return itemLevel;
    });

    qualityList.unshift(
      this.buildMenuItem({
        label: this.player.localize("Auto"),
        value: "auto",
        selected: true
      })
    );

    if (this._button) {
      this._button.createItems = function() {
        return qualityList;
      };
      this._button.update();
    }
  }

  onReload() {
    this.setState({ qualityList: []})

    if (this._button) {
      this._button.createItems = function() {
        return [];
      };
      this._button.update();
    }
  }

  /**
   * Sets quality (based on media height)
   *
   * @param {number} height - A number representing HLS playlist.
   */
  setQuality(height) {
    _map(this.player.qualityLevels(), (quality, key) => {
      quality.enabled = quality.height === height || height === "auto";
    });

    this._button.unpressButton();
  }
}

// Define default values for the plugin's `state` object here.
SelectorQuality.defaultState = { qualityList: [] };

// Include the version number.
SelectorQuality.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin("selectorQuality", SelectorQuality);

export default SelectorQuality;
