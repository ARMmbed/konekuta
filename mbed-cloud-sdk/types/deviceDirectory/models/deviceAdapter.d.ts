import { DeviceData as apiDevice, DeviceDataPostRequest as apiDeviceAdd, DeviceDataPatchRequest as apiDeviceUpdate } from "../../_api/device_catalog";
import { DeviceDirectoryApi } from "../deviceDirectoryApi";
import { AddDeviceObject, UpdateDeviceObject } from "../types";
import { Device } from "./device";
/**
 * Device Adapter
 */
export declare class DeviceAdapter {
    static map(from: apiDevice, api: DeviceDirectoryApi): Device;
    static addMap(from: AddDeviceObject): apiDeviceAdd;
    static updateMap(from: UpdateDeviceObject): apiDeviceUpdate;
}