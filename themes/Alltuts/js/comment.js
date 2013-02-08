﻿jQuery(document).ready(
    function(){

loadjs=false;

commentuser=$.cookie('comment_user');
if (commentuser)
{
 //[user,email,url]=commentuser.split('#@#');
 data=commentuser.split('#@#');
 $('#author').val(data[0]);
 $('#email').val(data[1]);
 $('#url').val(data[2]);
};

$('#commentform').ajaxForm({
        type:'post',
        dataType:  'json',
        beforeSubmit:function(formData,jqForm,options){
               var form = jqForm[0];

               if (form.author)
               {

                     if (!form.author.value)
                     {
                      showinfo('请输入你的名字!');
                      form.author.focus();
                      return false;
                     }
                     if (!form.email.value)
                     {
                        showinfo('请输入邮件地址');
                        form.email.focus();
                        return false;	
                     }
					 str=form.email.value;
if (str.charAt(0)=="." || str.charAt(0)=="@" || str.indexOf('@', 0)==-1|| str.indexOf('.', 0)==-1 || str.lastIndexOf("@")==str.length-1 || str.lastIndexOf(".")==str.length-1){showinfo('请输入正确的邮件地址');form.email.focus();return false;}
               }
                if($('#checkarea').css('display')=='block')
                               {
                                 if(!form.checkret.value)
                                 {
                                   alert('请输入验证码！');
                                   form.checkret.focus();
                                   return false;
                                 }

                               }

                 if (!form.comment.value)
                 {
                    showinfo('请输入留言内容');
                    form.comment.focus();
                    return false;
                 }

                 $('#s_msg').text('正在提交留言...').show();
                $("#submit").attr('disabled',true);

                 return true;

            },
        success:function(data){
            $("#submit").attr('disabled',false);
              if (data[0])
              {
                /*document.cookie=data[2];*/
                    alert('留言提交成功！');
                add_comment(data[1]);

                $('#s_msg').text('留言提交成功！');
                $('#comment').val('');
                if($('#checkarea').css('display')=='block')
                {
                    if($("#check_type").val()>0)
                    {
                        get_check_area($("#check_type").val());
                        reloadCheckImage();
                    }
                }
                $('#checkret').val('');
                location="#comments";
              }
              else
              {  if (data[1]==-102)
                 showinfo('验证码错误。');
                 $('#s_msg').text('留言提交失败！');
                 $('#checkret').focus();

              }
            }
        });
    }
)
function get_check_area(type)
{
    if (type==1)
    {
        $('#check').load('/checkcode/');
        $('#checkarea').show();
    }else if(type==2)
    {
        $('#check').html('<img id="checkimg" src="/checkimg/" style="border:0px;padding:0;float:left;margin-right:5px" title="点击图片更换验证码" onclick="reloadCheckImage();"/>');
        $('#checkarea').show();
    }

}

function showCheckImage()
{
    var img = document.getElementById('checkimg');
        img.src = "/checkimg/";
        img.style.visibility='visible';
}

function reloadCheckImage()
{
    var img = document.getElementById('checkimg');
    img.src += "?";
}

function showinfo(msg)
{
  alert(msg);
}
function add_comment(msg)
{
  comment=$(msg)
  if (!loadjs)
  {
  	$("#thecomments").prepend(comment).show();
  	$.getScript("http://dev.jquery.com/view/trunk/plugins/color/jquery.color.js", function(){
  		 comment.animate( { backgroundColor: '#fbc7c7' }, "slow")
					.animate( { backgroundColor: 'white' }, "slow")
					loadjs=true;
				});
  }else
  {
  	$("#thecomments").prepend(comment);
  	  comment.animate( { backgroundColor: '#fbc7c7' }, "slow")
					.animate( { backgroundColor: 'white' }, "slow")

  }
}

function quote(name,id,commid){
    var quoteMsg=document.getElementById(id).innerHTML;
    document.getElementById("comment").value='<a href=\"#comment-'+commid+'\">@'+name+'<\/a><blockquote>'+quoteMsg+'</blockquote>'+'\n';
    return true;
}

function backcomment(author,id){
    backdb=document.getElementById('comment');
    backdb.focus();
    backdb.value=backdb.value+'<a href=\"#comment-'+id+'\">@'+author+'<\/a>'+'\n';
    return false;
}