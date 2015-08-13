/* 
The javascript bellow contains the script used on the Sample1.html and WizardSample.hmtl for the mockups
Author: Gabriel Fernandes
Date: 6/25/2015
Last Update: 6/25/2015
*/

// Counter used to determine how many times a new selection box can be created
var counterType = 0;
var counterDomain = 0;
var counterPlan = 0;
var counterService = 0;

var returnType = "";
//The following arrays futurely have to come from a query.
//They hold all the itens for each category.
var typeArray = ["blank", ""];
var domainArray = ["blank", ""];
var planArray = ["blank", ""];
var serviceArray = ["blank", ""];

// These arrays will be populated with the itens that have not been selected, so
// that it can be used to create the other boxes without the past selections.
var typeNonSelectedArray = [];
var domainNonSelectedArray = [];
var planNonSelectedArray = [];
var serviceNonSelectedArray = [];

// Event Handlers section 
$(document).ready(function(){
    // Function fired when a selection is made.
    $('body').on('change', '.sBoxes', function(){
        // Get the value from the element who fired the event.
        var value = $(this).val();
        // if the value is not blank, generate another box.
        if(value != "blank")
        {
            // get the parents id, to know where the selection came from.
            var parentID = $(this).parent().attr('id');

            // The following if chain checks where the event has been fired.
            // The if inside checks the counter to limit how many boxes are created.
            // Then the NonSelectedArray is generated and used to created the next box.
            if(parentID == 'pType')
            {
                if (counterType <= (typeArray.length/2)-2) 
                {
                    // Generate the NonSelectedArray.
                    typeNonSelectedArray = getNonSelectedArray(typeArray, typeNonSelectedArray, value, counterType);
                    // Increment the counter
                    counterType++;
                    // Generate the next selection box.
                    GenerateSelectionBox(typeNonSelectedArray, parentID, counterType);
                }
            }
            else if (parentID == 'pDomain')
            {
                if (counterDomain <= (domainArray.length/2)-2)
                {
                    // Generate the NonSelectedArray.
                    domainNonSelectedArray = getNonSelectedArray(domainArray, domainNonSelectedArray, value, counterDomain);
                    // Increment the counter
                    counterDomain++;
                    // Generate the next selection box.
                    GenerateSelectionBox(domainNonSelectedArray, parentID, counterDomain);
                }
            }
            else if (parentID == 'pPlan')
            {
                if (counterPlan <= (planArray.length/2)-2) 
                {
                    // Generate the NonSelectedArray.
                    planNonSelectedArray = getNonSelectedArray(planArray, planNonSelectedArray, value, counterPlan);
                    // Increment the counter
                    counterPlan++;
                    // Generate the next selection box.
                    GenerateSelectionBox(planNonSelectedArray, parentID, counterPlan);
                }
            }
            // Last case its a Service.
            else
            {
                if (counterService <= (serviceArray.length/2)-2) 
                {
                    // Generate the NonSelectedArray.
                    serviceNonSelectedArray = getNonSelectedArray(serviceArray, serviceNonSelectedArray, value, counterService);
                    // Increment the counter
                    counterService++;
                    // Generate the next selection box.
                    GenerateSelectionBox(serviceNonSelectedArray, parentID, counterService);
                }
            }
        }
    })
    
    // Resets the form
    $('.clear').click(function()
    {
        // Checks what was the button pressed
        if($(this).attr('id')=='sButton')
        {
            $('#StaticForm')[0].reset();
        }
        else
        {
            // Remove the selection boxes
            $('.sBoxes').remove();
            
            // Initialize the form
            initialize();

            // Reset the form
            $('#DynamicForm')[0].reset();
        }
    });

    $('.submit').click(function()
    {
        if($(this).attr('value')=='Generate JSON')
        {
            returnType = 'json';
        }
        else
        {
            returnType = 'csv';
        }
    })

    $('form').submit(function(e){
        console.log(e.target);
        var url = 'https://health.data.ny.gov/resource/vbkk-tipq.'+returnType+'?$limit=50000&$select=*';
        var typeChecked = 0;
        var domainChecked = 0;
        var planChecked = 0;
        var serviceChecked = 0;
        // Checks what was the button pressed
        if($(this).attr('id')=='StaticForm'){
            for(i = 1; i < typeArray.length/2; i++)
            {
                if($('#cType'+i).is(":checked"))
                {
                    if(typeChecked == 1)
                    {
                        url += " or payer='"+$('#cType'+i).val().replace(/_/g,' ')+"'";
                    }
                    else
                    {
                        url += "&$where=(payer='"+$('#cType'+i).val().replace(/_/g,' ')+"'";
                        typeChecked = 1;
                    }
                }
            }
            if(typeChecked == 1)
            {
                url += ")";
            }
            for(i = 1; i < domainArray.length/2; i++)
            {
                if($('#cDomain'+i).is(":checked"))
                {
                    if(domainChecked == 1)
                    {
                        url += " or payer='"+$('#cDomain'+i).val().replace(/_/g,' ')+"'";
                    }
                    else if(typeChecked == 1)
                    {
                        url += "and (domain='"+$('#cDomain'+i).val().replace(/_/g,' ')+"'";
                        domainChecked = 1;
                    }
                    if(typeChecked == 0)
                    {
                        url += "&$where=(domain='"+$('#cDomain'+i).val().replace(/_/g,' ')+"'";
                        domainChecked = 1;
                    }
                }
            }
            if(domainChecked == 1)
            {
                url += ")";
            }
            var planSelections = $('#sbPlan1').val();
            if(planSelections != null)
            {
                for(i = 0; i < planSelections.length; i++)
                {
                    if(planChecked == 1)
                    {
                        url += " or plan_name='"+planSelections[i].replace(/_/g,' ')+"'";
                    }
                    else if(typeChecked == 0 && domainChecked == 0)
                    {
                        url += "&$where=(plan_name='"+planSelections[i].replace(/_/g,' ')+"'";
                        planChecked = 1;
                    }
                    else if(typeChecked == 1 || domainChecked == 1)
                    {
                        url += "and (plan_name='"+planSelections[i].replace(/_/g,' ')+"'";
                        planChecked = 1;
                    }
                }
                if(planChecked == 1)
                {
                    url += ")";
                }
            }

            var serviceSelections = $('#sbService1').val();
            if(serviceSelections != null)
            {
                for(i = 0; i < serviceSelections.length; i++)
                {
                    if(serviceChecked == 1)
                    {
                        url += " or measure_description='"+serviceSelections[i].replace(/_/g,' ')+"'";
                    }
                    else if(typeChecked == 0 && domainChecked == 0 && planChecked == 0)
                    {
                        url += "&$where=(measure_description='"+serviceSelections[i].replace(/_/g,' ')+"'";
                        serviceChecked = 1;
                    }
                    else if(typeChecked == 1 || domainChecked == 1 || planChecked == 1)
                    {
                        url += "and (measure_description='"+serviceSelections[i].replace(/_/g,' ')+"'";
                        serviceChecked = 1;
                    }
                }
                if(serviceChecked == 1)
                {
                    url += ")";
                }
            }
            window.open(url);
        }
        else{
            function SQLHelper(pID, Counter, field, thisFlag, flag1, flag2, flag3){
                for(i = 1; i <= Counter+1; i++){
                    value = $('#'+pID+i).val();
                    if (value != 'blank') 
                    {
                        if(value != undefined)
                        {
                            console.log(thisFlag);
                            if(thisFlag == 1)
                            {
                                url += " or "+field+"='"+value.replace(/_/g,' ')+"'";
                            }
                            else if(flag1 == 0 && flag2 == 0 && flag3 == 0)
                            {
                                url += "&$where=("+field+"='"+value.replace(/_/g,' ')+"'";
                                thisFlag = 1;
                            }
                            else if(flag1 == 1 || flag2 == 1 || flag3 == 1)
                            {
                                url += " and ("+field+"='"+value.replace(/_/g,' ')+"'";
                                thisFlag = 1;
                            }
                        }
                    }
                }
                if(thisFlag == 1)
                {
                    url += ")";
                }
                return thisFlag;
            };

            typeChecked = SQLHelper('pType', counterType, 'payer', typeChecked, domainChecked, planChecked, serviceChecked);
            domainChecked = SQLHelper('pDomain', counterDomain, 'domain', domainChecked, typeChecked, planChecked, serviceChecked);
            planChecked = SQLHelper('pPlan', counterPlan, 'plan_name', planChecked, typeChecked, domainChecked, serviceChecked);
            ServiceChecked = SQLHelper('pService', counterService, 'measure_description', serviceChecked, typeChecked, domainChecked, planChecked);
            console.log(url);
            window.open(url);
        }

    });
});

//Helper function that generates the selection elements.
function GenerateSelectionBox (sBoxElements, pID, counter) 
{
    // Create the selection element.
    var sel = $('<select class="sBoxes" id="'+pID+counter+'"></select>');
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
}

// This is a helper class that creates an array without the values selected,
// That are then updated to the particular NonSelected array.
// This is used so when that after a selection is made the next box doesn't contain
// past selected element.
function getNonSelectedArray(pArray, NonSelectedArray, value, counter)
{
    // A temporary array will be used the data from the NonSelectedArray as a source.
    // hence you're creating a second box or beyond.
    var tempArray = [];
    // If this is not the first generated box, use the NonSelectedArray as a source.
    // This guarantee that the previsious selected itens also get eliminated from the new list
    if (counter > 1) 
    {
        // Create a copy of NonSelectedArray.
        for(index in NonSelectedArray)
        {
            tempArray.push(NonSelectedArray[index]);
        }
        // clear the NonSelectedArray.
        NonSelectedArray = [];
    }
    else
    {
        // Create a copy of the MainArray.
        for(index in pArray)
        {
            tempArray.push(pArray[index]);
        }
    }

    // loops through the source array (tempArray)
    for(index = 0; index < tempArray.length; index += 2)
    {
        // If the value collected from the selection is not equal to a value on the source
        // add it to the new NonSelectedArray. 
        if(value != tempArray[index])
        {
            NonSelectedArray.push(tempArray[index]);
            NonSelectedArray.push(tempArray[index+1]);
        }
    }

    return NonSelectedArray;
}