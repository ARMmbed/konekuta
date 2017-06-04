import { FirmwareManifest as apiFirmwareManifest } from "../../_api/firmware_catalog";
import { UpdateApi } from "../updateApi";
import { FirmwareManifest } from "./firmwareManifest";
/**
 * Firmware Manifest Adapter
 */
export declare class FirmwareManifestAdapter {
    static map(from: apiFirmwareManifest, api: UpdateApi): FirmwareManifest;
}