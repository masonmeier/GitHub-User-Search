$(function(){
  $('#submit-btn').on('click', function(e){
    e.preventDefault();
    
    const username = $('#username').val();
    const requri   = 'https://api.github.com/users/'+username;
    const repouri  = 'https://api.github.com/users/'+username+'/repos';
    
    requestJSON(requri, function(json) {
      if(json.message == "Not Found" || username == '') {
        $('#ghapidata').html("<h2>No User Found</h2>");
      }
      
      else {
        let fullname   = json.name;
        let username   = json.login;
        let avitar     = json.avatar_url;
        let profileurl = json.html_url;
        let followersnum = json.followers;
        let followingnum = json.following;
        let reposnum     = json.public_repos;
        
        if(fullname == undefined) { fullname = username; }
        
        let outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
        outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+avitar+'" width="80" height="80" alt="'+username+'"></a></div>';
        outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
        outhtml = outhtml + '<div class="repolist">';
        
        let repositories;
        $.getJSON(repouri, function(json){
          repositories = json;   
          outputRepositories();                
        });          
        
        function outputRepositories() {
          if(repositories.length == 0) { outhtml = outhtml + '<p>0 repos found!</p></div>'; }
          else {
            outhtml = outhtml + '<p><strong>Repositories:</strong></p> <ul>';
            $.each(repositories, function(index) {
              outhtml = outhtml + '<li><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a></li>';
            });
            outhtml = outhtml + '</ul></div>'; 
          }
          $('#ghapidata').html(outhtml);
        } 
      } 
    }); 
  }); 
  
  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }
});