<?php
//  Copyright 2011 Mahesh Asolkar
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

//
// Library of functions
//

function http_doc_type() {
  echo '<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';

}

function show_feed($feed_url, $feed_name = '') {
  $feed = new SimplePie();
  $feed->set_feed_url($feed_url);
  $feed->init();
  $feed->handle_content_type();

  $feed_out = '';

  $feed_out .= '<a href="' . $feed->get_link() . '"'
            . ' title="' . (($feed_name == '') ? $feed->get_description()
                                               : $feed->get_title() . " : " . $feed->get_description())
            . '"><h3>' . (($feed_name == '') ? $feed->get_title() : $feed_name) . '</h3></a>' . "\n"
            . '<ul>' . "\n";
  # . '"><h3><img src="' . $feed->get_favicon() . '"> '
  foreach ($feed->get_items(0, 10) as $item) {
    $feed_out .= '  <li><a href="' . $item->get_permalink() . '">'
              . $item->get_title() . '</a> <div class="timestamp">'
              . $item->get_date() . '</span></li>' . "\n";
  }
  $feed_out .= '</ul>' . "\n";

  return $feed_out;
}

function first_from_feed($feed_url) {
  $feed = new SimplePie();
  $feed->set_feed_url($feed_url);
  $feed->init();
  $feed->handle_content_type();

  $first_out = '';

  foreach ($feed->get_items(0, 1) as $item) {
    $tweet = $item->get_title();
    $tweet = preg_replace('/^asolkar:\s+/', '', $tweet);

    $first_out .= '<a href="' . $item->get_permalink() . '">'
              . $tweet . '</a> <div class="timestamp">'
              . $item->get_date() . '</div>' . "\n";
  }

  return $first_out;
}

function feed_to_json($feed_url, $feed_name = '') {
  $feed = new SimplePie();
  $feed->set_feed_url($feed_url);
  $feed->init();
  $feed->handle_content_type();

  $feed_struct = array();

  foreach ($feed->get_items(0, 10) as $item) {
    $feed_item = array(
      'url' => $item->get_permalink(),
      'title' => $item->get_title(),
      'published_on' => $item->get_date()
    );
    array_push($feed_struct, $feed_item);
  }

  return json_encode ($feed_struct);
}


function fetch ($service, $url) {

  if ($service == 'twitter') {
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_exec($crl);
    curl_close($crl);
  } elseif ($service == 'github') {
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_exec($crl);
    curl_close($crl);
  } elseif ($service == 'feed') {
    echo feed_to_json ($url);
  }
}

?>
