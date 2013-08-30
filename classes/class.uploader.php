<?php
class uploader {
	// Target directory
	private $folder; // finish with "/"
	// The actual file
	private $file;
	// The actual filename
	private $filename;
	// The actual filesize
	private $filesize;
	// The actual file extension
	private $extension;
	// Maximum filesize
	private $max_size = 500000;
	// Permitted extensions
	private $extensions = Array('.pdf');
	// Uploaded file
	private $uploaded_file;
	// Errors
	private $errors = Array();

	public function upload() {

		if (!$this->filesize || !$this->filename || !$this->folder || !$this->file || !$this->extension) {
			array_push($this->errors, "Upload failed.");
			return false;
		}

		if ($this->filesize > $this->max_size) {
			array_push($this->errors, "File size too high.");
			return false;
		}

		if (!in_array($this->extension, $this->extensions)) {
			array_push($this->errors, "Invalid file.");
			return false;
		}

		if (!is_dir($this->folder)) {
			mkdir($this->folder, 0777);
		}

		$num = 0;
		while (file_exists($this->folder . $num . $this->filename)) {
			$num++;
		}

		if(move_uploaded_file($this->file['tmp_name'], $this->folder . $num . $this->filename)) {
			sleep(1);
			$this->uploaded_file = $this->folder . $num . $this->filename;
			return $this->get_uploaded_file();
		}
	}

	public function get_uploaded_file() {
		if (!$this->uploaded_file) {
			return false;
		}
		return $this->uploaded_file;
	}

	/**
	*	Passing the $_FILES element to the uploader
	*	Gives the name and extension by default.
	*/
	public function set_file($file) {
		if (isset($file['name'])) {
			$this->file = $file;
			$this->filename = basename($this->file['name']);
			$this->filesize = filesize($this->file['tmp_name']);
			$this->strip_name();

			$this->extension = strrchr($this->file['name'], '.');
		}
		return $this;
	}

	/**
	*	Make sure the file as a decent name that wont
	*	explode the server.
	*/
	public function strip_name() {
		if ($this->filename) {
			$this->filename = strtr($this->filename, 
				  'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 
				  'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
			$this->filename = preg_replace('/([^.a-z0-9]+)/i', '-', $this->filename);
		}
	}

	/**
	*	Change the default uploaded name.
	*/
	public function set_filename($name) {
		if ($name && $this->file) {
			$this->filename = $name;
			$this->strip_name();
		}
		return $this;
	}

	/**
	*	Set the target path.
	*/
	public function set_folder($path) {
		if ($path) {
			$this->folder = $path;
		}
		return $this;
	}

	/**
	*	Extending the permitted extensions
	*/
	public function add_extension($ext) {
		if (is_array($ext)) {
			$this->extensions = array_merge($this->extensions, $ext);
		}
		if (is_string($ext)) {
			array_push($this->extensions, $ext);
		}
	}
}

?>