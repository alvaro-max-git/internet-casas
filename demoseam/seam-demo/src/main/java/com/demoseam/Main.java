package com.demoseam;

import java.util.List;

import com.seam.api.Seam;
import com.seam.api.resources.locks.LocksClient;
import com.seam.api.resources.locks.requests.LocksUnlockDoorRequest;
import com.seam.api.types.ActionAttempt;
import com.seam.api.types.Device;


public class Main {

    public static void main(String[] args) {
  
    String SEAM_API_KEY = System.getenv("SEAM_API_KEY");
    System.out.println("SEAM_API_KEY: " + SEAM_API_KEY);
    
    // If the environment variable is not found, use a default value
    if (SEAM_API_KEY == null) {
        SEAM_API_KEY = "seam_testyG1X_892xxQeWE8hUe6HuNDszDDa6"; // Your API key from CMD
        System.out.println("Using hardcoded API key: " + SEAM_API_KEY);
    }

    Seam seam = Seam.builder()
      .apiKey(SEAM_API_KEY)
      .build();

   System.out.println("Seam: " + seam);

    LocksClient locksClient = seam.locks();
    System.out.println("LocksClient: " + locksClient);

    List<Device> allDevices = locksClient.list();
    System.out.println("allDevices: " + allDevices);

    Device frontDoor = allDevices.get(0);

    ActionAttempt actionAttempt = seam.locks()
          .unlockDoor(LocksUnlockDoorRequest.builder()
            .deviceId(frontDoor.getDeviceId())
            .build());
            
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