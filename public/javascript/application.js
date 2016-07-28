$(function() {
  $("#loadPlayers").on('click', function() {
    var table = $("table").find('tbody').empty();
    $.getJSON("/players", function(players) {
      players.forEach(function(player) {
        var row = $("<tr>");
        //Progressive Enhancement
        var a = $("<a>").attr('href', '/players/'+player.id).text(player.name).addClass('playerLink');
        $("<td>").append(a).appendTo(row);
        $("<td>").text(player.number).appendTo(row);
        $("<td>").text(player.position).appendTo(row);
        $("<td>").text(player.height).appendTo(row);
        $("<td>").text(player.weight).appendTo(row);
        row.appendTo(table); 
      });
    });
    $("#playerIndex").removeClass('hidden');
    $("#playerShow").addClass('hidden');
  });

  $("table").on('click', ".playerLink", function(event) {
    event.preventDefault();
    $.getJSON($(this).attr('href'), function(player) {
      $("h2").text(player.name);
      $("dd").each(function(index, el) {
        var dd = $(el);
        var data = player[dd.data('field')];
        dd.text(data).data('original', data);
      });
      $("#editPlayer").data('id', player.id);
    });
    $("#playerIndex").addClass('hidden');
    $("#playerShow").removeClass('hidden');
  });

  $("dl").on('blur', 'dd', function() {
    if ($(this).data('original') !== $(this).text()) {
      $("#editPlayer").removeAttr('disabled');
    }
  });

  $("#editPlayer").on('click', function() {
    var id = $(this).data('id');

    if (!id) {
      return false;
    }

    var player = {
      name: $("h2").text()
    };
    
    $("dd").each(function(index, el) {
      var dd = $(el);
      var field = dd.data('field');
      player[field] = dd.text();
    });

    $.post("/players/"+id+"/update", player, function(response) {
      if (response.success) {
        alert("Player updated");
      } else {
        alert("You suck."); 
      }
    }, 'json');
  });
});
