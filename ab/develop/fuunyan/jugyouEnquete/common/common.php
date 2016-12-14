<?php

function getCurriculumText($curriculumID){
    if($curriculumID == 1){
        return '国語';
    }else if($curriculumID == 2){
        return '数学';
    }else if($curriculumID == 3){
        return '英語';
    }else if($curriculumID == 4){
        return '理科';
    }else if($curriculumID == 5){
        return '社会';
    }else if($curriculumID == 6){
        return '音楽';
    }else if($curriculumID == 7){
        return '美術';
    }else if($curriculumID == 8){
        return '技家';
    }else if($curriculumID == 9){
        return '保体';
    }else {
        return 'その他';
    }
}


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

