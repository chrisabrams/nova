import {
  NovaExtensionAction,
  NovaExtensionActionList,
  NovaExtensionActionType,
  NovaExtensionEvent,
  NovaExtensionEventKind,
  NovaExtensionEventList,
  NovaExtensionMetadata,
} from "./types.ts";

class NovaExtension {
  public interfaceVersion = "0"; // What version of the Nova Extension interface.

  public actions: NovaExtensionActionList = [];
  public events: NovaExtensionEventList = [];

  public desc: NovaExtensionMetadata["desc"];
  public name: NovaExtensionMetadata["name"];
  public title: NovaExtensionMetadata["title"];
  public version: NovaExtensionMetadata["version"];

  constructor({ desc, name, title, version }: NovaExtensionMetadata) {
    this.desc = desc;
    this.name = name;
    this.title = title;
    this.version = version;
  }

  static create(metdata: NovaExtensionMetadata) {
    return new NovaExtension(metdata);
  }

  extend(
    type: NovaExtensionActionType,
    action: NovaExtensionAction<typeof type>
  ) {
    this.actions.push({ action, type });

    return this;
  }

  on(kind: NovaExtensionEventKind, action: NovaExtensionEvent<typeof kind>) {
    this.events.push({ action, kind });

    return this;
  }
}

export default NovaExtension;
