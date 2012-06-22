//
// Configuration Variables
//
var twitter_user_id = 'asolkar';
//var twitter_user_id = 12420422;

//
// Javascript helpers
//
function latest_twitter_status() {
  // var tw_st_url = escape ("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + twitter_user_id + "&count=1");
  var tw_st_url = escape ("http://identi.ca/api/statuses/user_timeline.json?screen_name=" + twitter_user_id + "&count=1");
  $.ajax({
    url: "web_lib/api.php?s=twitter&u=" + tw_st_url,
    dataType: 'json',
    success: function(data) {
      var tweet = data[0].text;
      tweet = link_urls(tweet);
      tweet = link_mentions(tweet);
      $('#twitter_status').html(
        tweet
        // + '<a href="http://twitter.com/asolkar/statuses/'
        // + data[0].id_str + '">'
        + '<div class="timestamp">'
        + '<a href="http://identi.ca/notice/'
        + data[0].id + '">'
        + data[0].created_at + '</a></div>');
      // expand_links($('#twitter_status'));
    },
    error: function(data, txt_sts, err_code) {
      // alert (err_code + " : " + txt_sts);
    }
  });
}

function twitter_feed() {
  // var tw_st_url = escape ("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + twitter_user_id + "&count=10");
  var tw_st_url = escape ("http://identi.ca/api/statuses/user_timeline.json?screen_name=" + twitter_user_id + "&count=10");
  $.getJSON(
    "web_lib/api.php?s=twitter&u=" + tw_st_url,
    function(data) {
      var ht = "<h3>identi.ca @" + twitter_user_id + "</h3><ul>";
      var idx;
      for (idx=0; idx<10; idx++) {
        var tweet = data[idx].text;
        tweet = link_urls(tweet);
        tweet = link_mentions(tweet);

        ht += '<li>'
              + tweet
              + '<div class="timestamp">'
              // + '<a href="http://twitter.com/asolkar/statuses/'
              // + data[idx].id_str + '">'
              + '<a href="http://identi.ca/notice/'
              + data[idx].id + '">'
              + data[idx].created_at + '</a></div></li>';
      }
      ht += "</ul>";
      $('#twitter_feed').html(ht);
    }
  );
}

function github_repos() {
  var github_url = escape ("https://api.github.com/users/asolkar/repos?sort=pushed");
  $.getJSON(
    "web_lib/api.php?s=github&u=" + github_url,
    function(data) {
      var ht = "<h3>GitHub Repos</h3><ul>";
      var idx;
      for (idx=0; idx<10; idx++) {
        ht += '<li><a href="' + data[idx].html_url + '">'
              + data[idx].full_name + '</a> - '
              + data[idx].description
              + '<div class="timestamp">Pushed '
              + data[idx].pushed_at + '</div></li>';
      }
      ht += "</ul>";
      $('#github_repos').html(ht);
    }
  );
}

function blog_feed() {
  var blog_url = escape ("http://feeds2.feedburner.com/mahesha/tech");
  $.getJSON(
    "web_lib/api.php?s=feed&u=" + blog_url,
    function(data) {
      var ht = "<h3>Day in, day out ...</h3><ul>";
      var idx;

      for (idx=0; idx<10; idx++) {
        ht += '<li><a href="' + data[idx].url + '">'
              + data[idx].title + '</a>'
              + '<div class="timestamp">'
              + data[idx].published_on + '</div></li>';
      }
      ht += "</ul>";
      $('#blog_feed').html(ht);
    }
  );
}

function link_urls (text) {
  var url_pattern = /(http:\/\/[a-z0-9\.\/]+)/gi;
  return text.replace(url_pattern, "<a href=\"$1\">$1</a>");
}
function link_mentions (text) {
  var url_pattern = /@([a-z0-9_]+)/gi;
  return text.replace(url_pattern, "@<a href=\"http://twitter.com/$1\">$1</a>");
}

function expand_links(head) {
  $(head)
  .find('a')
  .hover( function () {
    $.ajax({
      url: this.href,
      statusCode: {
        301: function () {
          alert ("Link: " + this);
        }
      }
    });
  });
}
