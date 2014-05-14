/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#selllumber').click(sellAllLumber);
    $('#sellwood').click(sellWood);
    $('#forest').on('click', '.tree.alive', grow);
    $('#forest').on('click', '.chop', chop);
  }

  function chop(){
    var tree = $(this).parent();
    var treeId = $(this).prev().prev().data('id');
    console.log('clicked tree is '+ treeId);
    $(this).parent().hide();

    $.ajax({
      url: `/tree/${treeId}/chop`,
      type: 'DELETE',
      success: response => {
        console.log(response);
        $('#lumber').text(response.wood+' logs');
      }
    });
  }

  function grow(){
    var tree = $(this).parent();
    var treeId = $(this).data('id');

    $.ajax({
      url: `/tree/${treeId}/grow`,
      type: 'PUT',
      dataType: 'html',
      success: responseTree => {
        tree.replaceWith(responseTree);
      }
    });
  }

  function getForest(){
    var userId = $('#username').attr('data-id');

    $.ajax({
      url: `/forest/${userId}`,
      type: 'GET',
      dataType: 'html',
      success: responseTrees => {
        $('#forest').empty().append(responseTrees);
      }
    });
  }


  function seed(){
    var userId = $('#username').data('id');

    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId: userId},
      success: responseTree => {
        $('#forest').append(responseTree);
      }
    });
  }

  function sellAllLumber(){
    var userId = $('#username').attr('data-id');

    $.ajax({
      url: `/sellall/${userId}`,
      type: 'PUT',
      success: response => {
        console.log(response);
        $('#lumber').text(response.wood);
        $('#cash').text('$'+response.cash);
      }
    });
  }

  function sellWood(e){
    var userId = $('#username').attr('data-id');
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: `/sell/${userId}`,
      type: 'PUT',
      data: data,
      success: response => {
        console.log('-------NODE RESPONSE--------');
        console.log(response);
        $('#woodamount').val('');
        $('#lumber').text(response.wood);
        $('#cash').text('$'+response.cash);
      }
    });

    e.preventDefault();
  }

  function login(e){
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: response => {
        $('#login').prev().val('');
        $('#username').attr('data-id', response._id);
        $('#username').text(response.username);
        $('#lumber').text(response.wood+' logs');
        $('#cash').text('$'+response.cash);
      }
    });

    e.preventDefault();
  }

})();
