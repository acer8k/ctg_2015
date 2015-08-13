// Create all initial selection boxes
$.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=plan_name&$group=plan_name&$order=plan_name")
.done(function( data ){
    $.each( data, function(i, item) {
        planArray.push(item.plan_name.replace(/\s/g,"_"));
        planArray.push(item.plan_name);
    })
    $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=measure_description&$group=measure_description&$order=measure_description")
    .done(function( data ){
        $.each( data, function(i, item) {
            serviceArray.push(item.measure_description.replace(/\s/g,"_"));
            serviceArray.push(item.measure_description);
        })
        $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=domain&$group=domain&$order=domain")
        .done(function( data ){
            $.each( data, function(i, item) {
                domainArray.push(item.domain.replace(/\s/g,"_"));
                domainArray.push(item.domain);
            })
            console.log(domainArray);
            $.getJSON( "https://health.data.ny.gov/resource/vbkk-tipq.json?$select=payer&$group=payer&$order=payer")
                .done(function( data ){
                    $.each( data, function(i, item) {
                        typeArray.push(item.payer.replace(/\s/g,"_"));
                        typeArray.push(item.payer);
                    })

                    initialize();
            });
        });
    });
});

function initialize()
{
    counterType = 1;
    counterDomain = 1;
    counterPlan = 1;
    counterService = 1;

    typeNonSelectedArray = [];
    domainNonSelectedArray = [];
    planNonSelectedArray = [];
    serviceNonSelectedArray = [];

    GenerateSelectionBox(typeArray, "pType", counterType);
    GenerateSelectionBox(domainArray, "pDomain", counterDomain);
    GenerateSelectionBox(planArray, "pPlan", counterPlan);
    GenerateSelectionBox(serviceArray, "pService", counterService);

    PopulateMultiSelectionBoxes();
}

function PopulateMultiSelectionBoxes()
{
    for(index = 0; index < planArray.length; index+=2)
    {
        $('#sbPlan1').append('<option value='+planArray[index]+'>'+planArray[index+1]+'</option>');
    }
    for(index = 0; index < serviceArray.length; index+=2)
    {
        $('#sbService1').append('<option value='+serviceArray[index]+'>'+serviceArray[index+1]+'</option>');
    }
}

$(document).ready(function(){
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
});