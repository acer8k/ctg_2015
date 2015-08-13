var pastSQL = [];
var pastSelection = '';

$.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=payer&$group=payer&$order=payer")
    .done(function( data ){
        $.each( data, function(i, item) {
            typeArray.push(item.payer.replace(/\s/g,"_"));
            typeArray.push(item.payer);
        })

        initialize();
});

function initialize()
{
    pastSelection = "Selected fields: <br> ";
    counterType = 1;
    counterDomain = 1;
    counterPlan = 1;
    counterService = 1;
    pastSQL[0] = '0';

    typeNonSelectedArray = [];
    domainNonSelectedArray = [];
    planNonSelectedArray = [];
    serviceNonSelectedArray = [];

    GenerateSelectionBox(typeArray, "pType", counterType);
}

//Event Handlers
$(document).ready(function()
{
    $('.next').click(function()
    {
        if($(this).attr('class') != 'active')
        {
            var activeDiv = $(this).parent();
            var nextDiv = activeDiv.next();
            var activeTab = $('.nav').children('.active');
            var nextTab = activeTab.next();
            var finder = activeTab.text();
            SelectionColector(finder);
            activeTab.toggleClass('active');
            nextTab.toggleClass('active');
            activeDiv.toggleClass('active');
            nextDiv.toggleClass('active');
            //populate this container
            $('.pastSelections').html(pastSelection);
        }
    });
});

function SelectionColector(finder)
{
    var url = '';
    if(finder == "Type")
    {
        url = boxElementsSQLGenerator('domain', finder, counterType, 'payer');
        console.log(url);
        domainArray = ['blank', ''];
        $.getJSON(url)
        .done(function( data ){
            $.each( data, function(i, item) {
                if(item.domain != domainArray[domainArray.length-1])
                {
                    domainArray.push(item.domain.replace(/\s/g,"_"));
                    domainArray.push(item.domain);
                }
            })    
            GenerateSelectionBox(domainArray, 'pDomain', counterDomain);    
        });
    }
    else if(finder == "Domain")
    {
        url = boxElementsSQLGenerator('plan_name', finder, counterDomain, 'domain');
        console.log(url);
        planArray = ['blank', ''];
        $.getJSON(url)
        .done(function( data ){
            $.each( data, function(i, item) {
                if(item.plan_name != planArray[planArray.length-1])
                {
                    planArray.push(item.plan_name.replace(/\s/g,"_"));
                    planArray.push(item.plan_name);
                }
            })    
            GenerateSelectionBox(planArray, 'pPlan', counterPlan);    
        });
        
    }
    else if(finder == "Plan")
    {
        url = boxElementsSQLGenerator('measure_description', finder, counterPlan, 'plan_name');
        console.log(url);
        serviceArray = ['blank', ''];
        $.getJSON(url)
        .done(function( data ){
            $.each( data, function(i, item) {
                if(item.measure_description != serviceArray[serviceArray.length-1])
                {
                    serviceArray.push(item.measure_description.replace(/\s/g,"_"));
                    serviceArray.push(item.measure_description);
                }
            })    
            GenerateSelectionBox(serviceArray, 'pService', counterService);    
        });
    }
};

function GenerateNextBox (sBoxElements, pID, counter) 
{
    // Create the selection element.
    var sel = $('<select class="sBoxes" id="'+pID+counter+'"></select>');
    alert(pID);
    // loops through the array of options.
    for(index = 0; index < sBoxElements.length; index += 2)
    {
        // Append the option to the selection box.
        if(index == 0)
        {
            sel.append('<option value='+sBoxElements[index]+' selected>'+sBoxElements[index+1]+'</option>');
        }
        else
        {
            sel.append('<option value='+sBoxElements[index]+'>'+sBoxElements[index+1]+'</option>');
        }
    }
    // Append the selection box to the correct paragraph
    $('#'+pID).append(sel);
};

 function boxElementsSQLGenerator(field, finder, counter, filter)
 {
    var url = '';
    var value = '';
    thisFlag = 0;
    if(pastSQL[0] == '0')
    {
        pastSQL[1] = '$limit=50000&$select='+field+','+filter;
        pastSQL[2] = '&$group='+field+','+filter;
        pastSQL[3] = '';
        url = 'https://health.data.ny.gov/resource/vbkk-tipq.json?'+pastSQL[1]+pastSQL[2]+'&$order='+field;
    }
    else
    {
        pastSQL[1] += ','+field;
        pastSQL[2] += ','+field;
        url = 'https://health.data.ny.gov/resource/vbkk-tipq.json?'+pastSQL[1]+pastSQL[2]+'&$order='+field;
    }
    
    for(i = 1; i <= counter+1; i++)
    {
        value = $('#p'+finder+i).val();
        if (value != 'blank') 
        {
            if(value != undefined)
            {
                if(thisFlag == 1)
                {
                    url += " or "+filter+"='"+value.replace(/_/g,' ')+"'";
                    pastSQL[3] += " or "+filter+"='"+value.replace(/_/g,' ')+"'";
                    pastSelection += ', ' + value.replace(/_/g,' ');
                }
                else if(pastSQL[0] == '1')
                {
                    url += pastSQL[3];
                    url += " and ("+filter+"='"+value.replace(/_/g,' ')+"'";
                    pastSQL[3] += "and ("+filter+"='"+value.replace(/_/g,' ')+"'";
                    thisFlag = 1;
                    pastSelection += finder + '(s): ' + value.replace(/_/g,' ');
                }
                else
                {
                    url += "&$where=("+filter+"='"+value.replace(/_/g,' ')+"'";
                    pastSQL[3] += "&$where=("+filter+"='"+value.replace(/_/g,' ')+"'";
                    thisFlag = 1;
                    pastSelection += finder + '(s): ' + value.replace(/_/g,' ');
                }
            }

        }
    }
    if(thisFlag == 1)
    {
        pastSelection += '<br>';
        pastSQL[0] = '1';
        url += ")";
        pastSQL[3] += ")";
    }
    else
    {
        pastSelection += finder + '(s): ALL <br>';
    }
    return url;
};