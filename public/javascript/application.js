$(function() {
  var table = $("#canucks").find('tbody');

  function playerRow(data, tr) {
    $("<td>").text(data).appendTo(tr);
  }

  var handlers = {
    displayPlayer: function(player) {
      var tr = $("<tr>").appendTo(table);

      ["number", "name", "position", "height", "weight"].map(function(field) {
        playerRow(player[field], tr);
      });

      $("<button>").text("Delete Player").data('id', player.id).appendTo(tr).addClass('deleteBtn');
    },
    loadPlayers: function() {
      $.getJSON('/players', function(players) {
        table.empty();
        players.forEach(handlers.displayPlayer);
        $("#playerForm").hide();
        $("#results").show();
      });
    },
    deleteBtn: function() {
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
    },
    addPlayer: function() {
      $("#results").hide();
      $("#playerForm").show(); 
    },
    newPlayer: function(evt) {
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
    },
    search: function(evt) {
      if (evt.keyCode == 13) {
        var query = $(this).val();
        $.getJSON('/search/'+query, function(players) {
          table.empty();
          players.forEach(handlers.displayPlayer);
        });
      }
    }
  };

  $("#loadPlayers").on('click', handlers.loadPlayers);
  $("#canucks").on('click', 'button.deleteBtn', handlers.deleteBtn);
  $("#addPlayer").on('click', handlers.addPlayer);
  $("#newPlayer").on('submit', handlers.newPlayer);
  $("#search").on('keyup', handlers.search);
});
