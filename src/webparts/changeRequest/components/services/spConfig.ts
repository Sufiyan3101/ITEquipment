// import { SPFI, spfi } from "@pnp/sp";
// import { SPFx } from "@pnp/sp";
// import { LogLevel, PnPLogging } from "@pnp/logging";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";
// import "@pnp/sp/attachments";
// import "@pnp/sp/site-users/web";

// let _sp: SPFI | null = null;

// export const initializeSP = (context: any): void => {
//   console.log("initializeSP called with context:", !!context);
//   _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
//   console.log("SP initialized:", !!_sp);
// };

// export const getSP = (): SPFI => {
//   if (!_sp) {
//     throw new Error("SP not initialized. Call initializeSP first.");
//   }
//   return _sp;
// };


import { SPFI, spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";

// Import all required PnP modules
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";

let _sp: SPFI | null = null;

/**
 * Initialize PnP SP with SharePoint context
 * Must be called in webpart onInit()
 */
export const initializeSP = (context: any): void => {
  console.log("initializeSP called with context:", !!context);
  _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  console.log("SP initialized:", !!_sp);
};

/**
 * Get PnP SP instance
 * Throws error if not initialized
 */
export const getSP = (): SPFI => {
  if (!_sp) {
    throw new Error("SP not initialized. Call initializeSP first.");
  }
  return _sp;
};

/**
 * Check if SP is initialized
 */
export const isSPInitialized = (): boolean => {
  return _sp !== null;
};