$(function() {
  var table = $("#canucks").find('tbody');

  function displayPlayer(player) {
    var tr = $("<tr>").appendTo(table);

    $("<td>").text(player.number).appendTo(tr); 
    $("<td>").text(player.name).appendTo(tr); 
    $("<td>").text(player.position).appendTo(tr); 
    $("<td>").text(player.height).appendTo(tr); 
    $("<td>").text(player.weight).appendTo(tr); 
    $("<button>").text("Delete Player").data('id', player.id).appendTo(tr).addClass('deleteBtn');

  }

  $("#loadPlayers").on('click', function() {
    $.getJSON('/players', function(players) {
      table.empty();
      players.forEach(displayPlayer);
      $("#playerForm").hide();
      $("#results").show();
    });
  });

  $("#canucks").on('click', 'button.deleteBtn', function() {
    var btn = $(this);
    var id = btn.data('id');
    $.getJSON('/players/'+id+'/delete', function(results) {
      if (results.result) {
        alert("Deleted player.");
        btn.parents('tr').remove();
      } else {
        alert("WTF");
      }
    });
  });

  $("#addPlayer").on('click', function() {
    $("#results").hide();
    $("#playerForm").show(); 
  });

  $("#newPlayer").on('submit', function(evt) {
    evt.preventDefault();
    var jersey = $("#jersey").val();
    var name = $("#name").val();
    var position = $("#position").val();
    if (jersey !== '' && name !== '' && position !== '') {
      $.post('/players/create', {number: jersey, name: name, position: position}, function(results) {
        if (results.result) {
          alert("Added player with ID: " + results.id);
        } else {
          alert("WTF");
        }
      }, 'json');
    } 
  });

  $("#search").on('keyup', function(evt) {
    if (evt.keyCode == 13) {
      var query = $(this).val();
      $.getJSON('/search/'+query, function(players) {
        table.empty();
        players.forEach(displayPlayer);
      });
    }
  });
});
