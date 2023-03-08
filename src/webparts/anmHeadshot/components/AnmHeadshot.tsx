import * as React from "react";
import { IAnmHeadshotProps } from "./IAnmHeadshotProps";
import { sp } from "@pnp/sp/presets/all";
import MainHeadShot from "./MainHeadShot";
import "./../ExternalRef/styleSheets/Styles.css";

export default class AnmHeadshot extends React.Component<
  IAnmHeadshotProps,
  {}
> {
  constructor(prop: IAnmHeadshotProps) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }

  public render(): React.ReactElement<IAnmHeadshotProps> {
    return <MainHeadShot sp={sp} context={this.props.context} />;
  }
}
