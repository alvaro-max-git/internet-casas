package com.demoseam;

import java.util.List;

import com.seam.api.Seam;
import com.seam.api.resources.locks.LocksClient;
import com.seam.api.resources.locks.requests.LocksGetRequest;
import com.seam.api.resources.locks.requests.LocksUnlockDoorRequest;
import com.seam.api.types.ActionAttempt;
import com.seam.api.types.Device;

public class Main {

    public static void main(String[] args) {
  
      String SEAM_API_KEY = "seam_testKpVb_t1Qiw82sFJRv31ihiqjnVuQh"; // Your API key from CMD

    Seam seam = Seam.builder()
      .apiKey(SEAM_API_KEY)
      .build();

    System.out.println("Seam: " + seam);

    LocksClient locksClient = seam.locks();
    System.out.println("LocksClient: " + locksClient);

    List<Device> allDevices = locksClient.list();
  
    /*
    Device frontDoor = allDevices.get(0);
    System.out.println("frontDoor deviceId: " + frontDoor.getDeviceId());
    String deviceId = frontDoor.getDeviceId();
    */
    
    String deviceId = "1539df0e-60fd-455c-b4f4-91d8cfc025c4";

    ActionAttempt actionAttempt = seam.locks()
          .unlockDoor(LocksUnlockDoorRequest.builder()
            .deviceId(deviceId)
            .build());
    
    //comprobamos si la cerradura se ha abierto en el 
    Device device = locksClient.get(
                LocksGetRequest.builder()
                .deviceId(deviceId)
                .build());
    
    System.out.println("device: " + device.toString());
    
    System.out.println("actionAttempt: " + actionAttempt.isSuccess());


            
    /* 
     // Retrieve all devices, filtered by manufacturer,
      // which is one of several filters that list() supports.
      var allAugustLocks = seam.devices().list(DevicesListRequest.builder()
        .manufacturer(Manufacturer.AUGUST)
        .build());
      
      // Select the first device as an example.
      Device frontDoor = allAugustLocks.get(0);

      // Confirm that the device can remotely unlock.
      // You're using a capability flag here!
      if (frontDoor.getCanRemotelyUnlock())
      {
        
        // Perform the unlock operation
        // and return an action attempt.
        ActionAttempt actionAttempt = seam.locks()
          .unlockDoor(LocksUnlockDoorRequest.builder()
            .deviceId(frontDoor.getDeviceId())
            .build());
      }
    */
   
  }
}