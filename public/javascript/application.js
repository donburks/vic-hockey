$(function() {
  function addPlayerRow(text, row) {
    $("<td>").text(text).appendTo(row);
  }

  var eventHandlers = {
    loadPlayers: function() {
      $.getJSON("/players", ajaxHandlers.loadPlayers);
      $("#playerIndex").removeClass('hidden');
      $("#playerShow").addClass('hidden');
    },
    playerLink: function(event) {
      event.preventDefault();
      $.getJSON($(this).attr('href'), ajaxHandlers.playerLink);
      $("#playerIndex").addClass('hidden');
      $("#playerShow").removeClass('hidden');
    },
    dd: function() {
      if ($(this).data('original') !== $(this).text()) {
        $("#editPlayer").removeAttr('disabled');
      }
    },
    editPlayer: function() {
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

      $.post("/players/"+id+"/update", player, ajaxHandlers.editPlayer, 'json');
    }
  };

  var ajaxHandlers = {
    loadPlayers: function(players) {
      var table = $("table").find('tbody').empty();
      players.forEach(function(player) {
        var row = $("<tr>").appendTo(table);
        //Progressive Enhancement
        var a = $("<a>").attr('href', '/players/'+player.id).text(player.name).addClass('playerLink');
        $("<td>").append(a).appendTo(row);
        //Fields to be displayed in table, pulled from player object
        ['number', 'position', 'height', 'weight'].forEach(function(field) {
          addPlayerRow(player[field], row);
        });
      });
    },
    playerLink: function(player) {
      $("h2").text(player.name);
      $("dd").each(function(index, el) {
        var dd = $(el);
        var data = player[dd.data('field')];
        dd.text(data).data('original', data);
      });
      $("#editPlayer").data('id', player.id);
    },
    editPlayer: function(response) {
      if (response.success) {
        alert("Player updated");
      } else {
        alert("You suck." + response.errors); 
      }
    }
  };

  $("#loadPlayers").on('click', eventHandlers.loadPlayers);
  $("table").on('click', ".playerLink", eventHandlers.playerLink);
  $("dl").on('blur', 'dd', eventHandlers.dd);
  $("#editPlayer").on('click', eventHandlers.editPlayer);
});
