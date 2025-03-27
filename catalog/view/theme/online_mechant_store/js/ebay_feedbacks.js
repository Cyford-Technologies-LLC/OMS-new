function getAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) {
            success(xhr.responseText);
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function getEbayFeedbacks(baseUrl, page){

    if(isNaN(page)){
        page = 1;
    }
    
    
    showLoader();
    getAjax(baseUrl+'index.php?route=extension/module/ebay_feedbacks/getFeedbacks&page='+page, function(data){ 

        removeAllRowsFeedback();
        loadData(baseUrl, data);
        hideLoader();
        

    });


}



function pgOnClick(baseUrl, element){
    getEbayFeedbacks(baseUrl, element.innerHTML);
}

function pgPrevious(baseUrl){
    current = parseInt(document.getElementById("span_PageNumber").innerHTML)-1;
    if(current>0){
        document.getElementById("span_PageNumber").innerHTML = current;
        getEbayFeedbacks(baseUrl, current);
    }
}

function pgNext(baseUrl){
    current = parseInt(document.getElementById("span_PageNumber").innerHTML)+1;
    total = parseInt(document.getElementById("span_TotalNumberOfPages").innerHTML);

    if(current<=total){
        document.getElementById("span_PageNumber").innerHTML = current;
        getEbayFeedbacks(baseUrl, current);
    }
}


function generatePagination(baseUrl){

    document.getElementById("div_pagination").innerHTML = "";

    current = parseInt(document.getElementById("span_PageNumber").innerHTML);
    total = parseInt(document.getElementById("span_TotalNumberOfPages").innerHTML);

	var pageLimit = 5;
	var upperLimit, lowerLimit;
	var currentPage = lowerLimit = upperLimit = Math.min(current, total);

	for (var b = 1; b < pageLimit && b < total;) {
	    if (lowerLimit > 1 ) {
	        lowerLimit--; b++; 
	    }
	    if (b < pageLimit && upperLimit < total) {
	        upperLimit++; b++; 
	    }
    }
    
    //anchor Previous
    aPrev = document.createElement("a");
    aPrev.onclick = function(){ pgPrevious(baseUrl); };
    aPrev.innerHTML = "&laquo;";
    div_pagination.appendChild(aPrev);

	for (var i = lowerLimit; i <= upperLimit; i++) {

        a = document.createElement("a");
        a.innerHTML = i;
        a.id = "pg"+i;
        a.onclick = function(){ pgOnClick(baseUrl, this); };
        a.classList.remove("active");
	    if (i == currentPage){
	    	a.classList.add("active");
        }
        div_pagination.appendChild(a);
    }

    //anchor Next
    aNext = document.createElement("a");
    aNext.onclick = function(){ pgNext(baseUrl); };
    aNext.innerHTML = "&raquo;";
    div_pagination.appendChild(aNext);
    
}


function loadData(baseUrl, data){

    jsonObjData = JSON.parse(data);

    //populate table
    var feedbackDetails = jsonObjData.FeedbackDetailArray.FeedbackDetail;
    if(feedbackDetails.length>0){

        //
        document.getElementById("span_TotalNumberOfEntries").innerHTML = jsonObjData.PaginationResult.TotalNumberOfEntries;
        document.getElementById("span_PageNumber").innerHTML = jsonObjData.PageNumber;
        document.getElementById("span_TotalNumberOfPages").innerHTML = jsonObjData.PaginationResult.TotalNumberOfPages;

        generatePagination(baseUrl);

        for (i = 0; i < feedbackDetails.length; i++) {
            addRowFeedback(feedbackDetails[i]);
        }
    }
    else{
        if (!document.getElementById) return;

        tabBody = document.getElementById("tblFeedback");
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.colSpan = "4";

        text = document.createTextNode("No feedbacks found!");
        cell.appendChild(text);
        row.appendChild(cell);

        tabBody.appendChild(row);
    }
    
    

    
}

function showLoader(){
    document.getElementById("div_loader").style.display = "block";
    document.getElementById("div_feedbacks").style.display = "none";
}

function hideLoader(){
    document.getElementById("div_loader").style.display = "none";
    document.getElementById("div_feedbacks").style.display = "block";
}

function removeAllRowsFeedback(){
    var tabBody = document.getElementById("tblFeedback");
    while(tabBody.hasChildNodes())
    {
        tabBody.removeChild(tabBody.firstChild);
    }
}


function addRowFeedback(feedbackDetail)
{
    if (!document.getElementById) return;

    tabBody = document.getElementById("tblFeedback");

    row = document.createElement("tr");

    //image
    imageCell = document.createElement("td");
    imgTag = document.createElement("img");
    imgTag.alt = "type";
    imgTag.height = 16;
    imgTag.width = 16;
    switch (feedbackDetail.CommentType) {
        case "Positive":
            imgTag.src = "image/catalog/feedback_type_icons/Positive.png";
            break;
        case "Negative":
            imgTag.src = "image/catalog/feedback_type_icons/Negative.png";
            break;
        default:
            imgTag.src = "image/catalog/feedback_type_icons/Neutral.png";
            break;
    }
    imageCell.appendChild(imgTag);
    row.appendChild(imageCell);


    //feedback
    feedbackCell = document.createElement("td");
    pTag = document.createElement("p");
    strongTag = document.createElement("strong");
    commentText = document.createTextNode(feedbackDetail.CommentText);
    strongTag.appendChild(commentText);
    pTag.appendChild(strongTag);
    feedbackCell.appendChild(pTag);
    if(feedbackDetail.ItemTitle !== undefined){
        pTag = document.createElement("p");
        itemText = document.createTextNode(feedbackDetail.ItemTitle);
        pTag.appendChild(itemText);
        feedbackCell.appendChild(pTag);
    }
    row.appendChild(feedbackCell);


    //buyer
    buyerCell = document.createElement("td");
    pTag = document.createElement("p");
    strongTag = document.createElement("strong");
    userText = document.createTextNode(feedbackDetail.CommentingUser);
    strongTag.appendChild(userText);
    scoreText = document.createTextNode(" ("+feedbackDetail.CommentingUserScore+")");
    pTag.appendChild(strongTag);
    pTag.appendChild(scoreText);
    buyerCell.appendChild(pTag);
    row.appendChild(buyerCell);
    
    
    //when
    whenCell = document.createElement("td");
    whenText = document.createTextNode(feedbackDetail.CommentTime);
    whenCell.appendChild(whenText);
    row.appendChild(whenCell);


    tabBody.appendChild(row);


}