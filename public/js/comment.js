// 提交评论
$('.discuss_submit').on('click',function(){
    if($('.discuss_input').val()){
        $.ajax({
            type: 'post',
            url: '/api/comment',
            data: {
                content_id: $('.discuss_id').val(),
                msg: $('.discuss_input').val()
            },
            dataType: 'json',
            success: function(data){
                if(!data.code){
                    $('.discuss_input').val('');
                    getComment()
                }
            }
        })
    }

});
function getComment() {
    $.ajax({
        type: 'get',
        url: '/api/comment',
        data: {
            content_id: $('.discuss_id').val()
        },
        dataType: 'json',
        success: function(data){
            if(!data.code){
                renderComments( data.commentList );
            }
        }
    })

    function renderComments(list){
        var commentsStr = "";
        for(var i=0;i<list.length;i++){
            commentsStr += `<li>
                    <p class="discuss_user"><span>${list[i].userName}</span><i>发表于 ${list[i].postTime}</i></p>
                    <div class="discuss_userMain">
                        ${list[i].msg}
                    </div>
                </li>`
        };
        $('.discuss_list').html( commentsStr );
    };

}

getComment()
