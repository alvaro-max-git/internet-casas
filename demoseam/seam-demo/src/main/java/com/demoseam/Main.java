package com.demoseam;

import java.io.Console;
import java.util.*;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.seam.api.Seam;
import com.seam.api.core.ObjectMappers;
import com.seam.api.types.Device;
import com.seam.api.types.Manufacturer;
import com.seam.api.types.ActionAttempt;
import com.seam.api.resources.devices.requests.DevicesListRequest;
import com.seam.api.resources.locks.requests.LocksUnlockDoorRequest;

public class Main {

    public static void main(String[] args) {
  
    String SEAM_API_KEY = System.getenv("SEAM_API_KEY");

      Seam seam = Seam.builder()
        .apiKey(SEAM_API_KEY)
        .build();
  
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
    }
  }