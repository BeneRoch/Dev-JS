<?php
class ICS {
    var $data;
    var $name;
    var $organizer;
    var $email;
	
    function ICS($start,$end,$name,$email, $event_name, $description,$location,$organizer) {
		$this->organizer = $name;
		$this->email = $email;
		/**
				
			$ics_values = array(
				"VERSION:" 							=> "2.0",
				"BEGIN" 								=> ":VTIMEZONE",
				"TZID:" 									=> "US-Eastern",
				"END"									=> ":VTIMEZONE"
				"CALSCALE:" 						=> "GREGORIAN",
				"METHOD:"		 					=> "REQUEST",
				"BEGIN:" 								=> "VEVENT",
				"DTSTART;VALUE=DATE:" 	=> date("Ymd\THis\Z",strtotime($start)),
				"DTEND;VALUE=DATE:" 		=> date("Ymd\THis\Z",strtotime($end)+3600),
				"DTSTAMP:" 						=> date("Ymd\THis\Z",time()),
				"ORGANIZER;CN=" 				=> $organizer.":mailto:".$organizer,
				"UID:" 									=> "lauzonaccessories@locomotive_on_".time().md5($event_name.$email.$name),
				"CREATED:" 						=> date("Ymd\THis\Z",time()),
				"DESCRIPTION:" 					=> $description,
				"LAST-MODIFIED:" 				=> date("Ymd\THis\Z",time()),
				"TZOFFSETFROM:" 			=> "-0400",
				"TZOFFSETTO:" 					=> "-0500",
				"TZNAME:" 							=> "EST",
				"LOCATION:" 						=> $location,
				"SEQUENCE:" 							=> "0",
				"STATUS:" 							=> "CONFIRMED",
				"SUMMARY:" 						=> $event_name,
				"TRANSP:" 							=> "OPAQUE"
			);
			
		*/
		$ics_values = array(
			"VERSION:" 							=> "2.0",
			"CALSCALE:" 						=> "GREGORIAN",
			"METHOD:"		 					=> "REQUEST",
			"BEGIN:" 								=> "VEVENT",
			"DTSTART:" 							=> $this->unixToiCal(strtotime($start),4),
			"DTEND:" 								=> $this->unixToiCal(strtotime($end)+3600,4),
			"DTSTAMP:" 							=> date("Ymd\THis\Z",time()),
			"ORGANIZER;CN=" 			=> $organizer.":mailto:".$organizer,
			"UID:" 									=> "lauzonaccessories@locomotive_on_".time().md5($event_name.$email.$name),
			"CREATED:" 						=> $this->unixToiCal(time(),4),
			"DESCRIPTION:" 				=> $description,
			"LAST-MODIFIED:" 				=> $this->unixToiCal(time(),4),
			"LOCATION:" 						=> $location,
			"SEQUENCE:" 					=> "0",
			"STATUS:" 							=> "CONFIRMED",
			"SUMMARY:" 						=> $event_name,
			"TRANSP:" 							=> "OPAQUE"
		);
		
		
		$this->data = "BEGIN:VCALENDAR\nPRODID:-//lauzonaccessories//NONSGML v1.0//EN";
		foreach ($ics_values as $k => $v) {
			$this->data .= '
			'.$k.$v;
		}
			$this->data .= "
			END:VEVENT\nEND:VCALENDAR";
			}
	public function unixToiCal($uStamp = 0, $tzone = 0.0) {

		$uStampUTC = $uStamp + ($tzone * 3600);       
		$stamp  = date("Ymd\THis\Z", $uStampUTC);

		return $stamp;       

	} 
    function save() {
        file_put_contents('../uploads/ics/'.$this->name.".ics",$this->data);
    }
    function show() {
        header("Content-type:text/calendar");
        header('Content-Disposition: attachment; filename="'.$this->name.'.ics"');
        Header('Content-Length: '.strlen($this->data));
        Header('Connection: close');
        echo $this->data;
    }
	public function getICS() {
		return $this->data;
	}
}
?>