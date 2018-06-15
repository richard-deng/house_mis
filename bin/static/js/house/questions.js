/**
 * Created by admin on 2018/6/15.
 */
$(document).ready(function () {
    $('#container').jstree({
        'core' : {
            'multiple': false,		//单选
            'themes': {
                // "dots" : true      //用点连接层次
                "stripes": true
            },
            'check_callback': true, // 允许所有修改
            'data' : [{
                "id" : -1,
                "text" : "Root node",
                "icon" : "glyphicon glyphicon-question-sign",
                "children" : [
                    {
                        "id" : 1,
                        "text" : "Child node 1",
                        "icon" : "glyphicon glyphicon-question-sign",
                        "category" : "question"
                    },
                    {
                        "id" : 2,
                        "text" : "Child node 2",
                        "icon" : "glyphicon glyphicon-question-sign",
                        "category" : "question"
                    }
                ]
            }]
        },
        "plugins" : ["dnd", "contextmenu", "changed", "types"],
        "contextmenu":{
            "items":{
                "新建问题":{
                    "label": "新建问题",
                    "icon": "glyphicon glyphicon-plus",
                    "action": function(data){
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        inst.create_node(obj, {}, "last", function (new_node) {
                            try {
                                new_node.text="问题名称";
                                inst.edit(new_node);
                                console.log('create device finish');
                            } catch (ex) {
                                setTimeout(function () { inst.edit(new_node); },0);
                            }
                        });
                        console.log('create data ', data);
                    }
                },
                "重命名":{
                    "separator_before"  : false,
                    "separator_after"   : false,
                    "_disabled"         : false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                    "label"             : "重命名",
                    "shortcut_label"    : 'F2',
                    "icon"              : "glyphicon glyphicon-leaf",
                    "action"            : function (data) {
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        inst.edit(obj);
                        console.log('rename data', data);
                    }
                },
                "删除":{
                    "separator_before"  : false,
                    //"icon"              : false,
                    "separator_after"   : false,
                    "_disabled"         : false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
                    "label"             : "删除",
                    "icon"              :"glyphicon glyphicon-remove",
                    "action"            : function (data) {
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        if(inst.is_selected(obj)) {
                            inst.delete_node(inst.get_selected());
                        }
                        else {
                            inst.delete_node(obj);
                        }
                        console.log('delete data', data);
                    }
                }
            }
        }
    });

    /*
    $('#container').on("changed.jstree", function (e, data) {
        console.log(data.selected);
        console.log(data.changed.selected);	// newly selected
        console.log(data.changed.deselected); // newly deselected

    });
    */

    $('#select_one').on("click", function () {
        var instance = $('#container').jstree(true);
        instance.deselect_all();
        instance.select_node('-1');
    });

    $('#do_add_question').click(function(){
        console.log('add question');
        var ref = $('#container').jstree(true);
        var sel = ref.get_selected();
        console.log('selected ', sel);
        var sel_id = sel[0];
        var question = window.prompt('请输入问题');
        if(question){
            var inst = $.jstree.reference(sel_id);
            var obj = inst.get_node(sel_id);
            inst.create_node(obj, {}, "last", function (new_node) {
                try {
                    new_node.text=question;
                    new_node.icon="glyphicon glyphicon-question-sign";
                    new_node.category="question";
                    inst.edit(new_node);
                    console.log('create question finish');
                } catch (ex) {
                    setTimeout(function () { inst.edit(new_node); },0);
                }
            });

        }
    });

    $('#do_add_answer').click(function(){
        console.log('add answer');
        var ref = $('#container').jstree(true);
        var sel = ref.get_selected();
        console.log('selected ', sel);
        var sel_id = sel[0];
        var inst = $.jstree.reference(sel_id);
        var obj = inst.get_node(sel_id);
        var category = obj.category;
        console.log('category: ', category);
        if (category === 'answer'){
            window.alert('答案不能再添加');
            return;
        }
        var answer = window.prompt('请输入答案');
        if(answer){
            inst.create_node(obj, {}, "last", function (new_node) {
                try {
                    new_node.text=answer;
                    new_node.icon="glyphicon glyphicon-info-sign";
                    new_node.category="answer";
                    inst.edit(new_node);
                    console.log('create answer finish');
                } catch (ex) {
                    setTimeout(function () { inst.edit(new_node); },0);
                }
            });
        }
    });

    $('#do_rename').click(function(){
        console.log('rename');
        var ref = $('#container').jstree(true);
        var sel = ref.get_selected();
        console.log('selected ', sel);
        /*
         var sel_id = sel[0];
         var inst = $.jstree.reference(sel_id),
         obj = inst.get_node(sel_id);
         inst.edit(obj);
         */
        var content = window.prompt('请输入修改的内容');
        if(content){
            ref.set_text(sel, content);
        }
    });

    $('#do_delete').click(function(){
        var ref = $('#container').jstree(true);
        var sel = ref.get_selected();
        console.log('selected ', sel);
        var sel_id = sel[0];
        var inst = $.jstree.reference(sel_id);
        var obj = inst.get_node(sel_id);
        if(inst.is_selected(obj)) {
            inst.delete_node(inst.get_selected());
        }
        else {
            inst.delete_node(obj);
        }
    });
});