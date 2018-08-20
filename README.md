# Firebase Assignment - Train Scheduler (Basic - Recommended)

### Overview

This application is a train schedule application that incorporates Firebase to host arrival and departure data. The application will retrieve and manipulate this information with Moment.js. The website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

### Application details

* The website provides the following:
  
  * When adding trains, administrators are able to submit the following:
    
    * Train Name
    
    * Destination 
    
    * First Train Time -- in military time
    
    * Frequency -- in minutes
  
  * The app calculates when the next train will arrive, relative to the current time.
  
  * Users from many different machines must be able to view same train times.
  
  
* I also provide the following on the webiste "minutes to arrival" and "next train time" text once every minute. 

* I have added an `update` and `remove` buttons for each train. This let's the user edit the row's elements-- allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).

