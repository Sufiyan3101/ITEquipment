import { SPFI, spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp";

// IMPORTANT
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import "@pnp/sp/site-users/web";

let _sp: SPFI;

export const initializeSP = (context: any): void => {
  _sp = spfi().using(SPFx(context));
};

export const getSP = (): SPFI => {
  return _sp;
};