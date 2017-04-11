(function(){
  angular
    .module('mail')
    .service('mailService', mailService);

    mailService.$inject = ['$http', 'API_URLS', 'loginService', 'Upload'];

    function mailService($http, API_URLS, loginService, Upload){
      var service = {
          getMailsByDepartmentId: getMailsByDepartmentId,
          getMail: getMail,
          createMail: createMail,
          initMail: initMail,
          getActions: getActions,
          getAttachments: getAttachments,
          createAction: createAction,
          uploadFile: uploadFile,
          updateMail: updateMail,
          getMailsForFollowup: getMailsForFollowup,
          followUp: followUp,
          initFormCtrls: initFormCtrls,
          initPanels: initPanels,
          update:update,
          customDate: customDate
      }
      /**
       * [uploadFile description]
       * @param  {[type]} file    [description]
       * @param  {[type]} mail_id [description]
       * @return {[type]}         [description]
       */
      function uploadFile(file, mail_id) {
        var url = API_URLS.base_url + 'upload/' + mail_id
        return Upload.upload({
          url: url,
          file: file
        }).then(function( response ){
            return response
        })
      }
      /**
       * Initialize form controls
       * @return {[type]} [description]
       */
      function initFormCtrls(){
        return {
          subject: false,
          file_title: false,
          receipt_date: false,
          mail_date: false,
          sender: false,
          from_org: false,
          receipent: false
        }
      }
      /**
       * Initialize panels
       * @return {[type]} [description]
       */
      function initPanels(){
        return {
          subject: true,
          receipt_date: true,
          mail_date: true,
          sender: true,
          from_org: true,
          receipent: true,
          file_title: true
        }
      }

      function getMailsForFollowup() {
        var dept_id = loginService.getDepartmentId(),
            url = API_URLS.base_url + 'mails/departments/' + dept_id + '?follow_up=2'
        return $http
                .get(url)
                .then(handleSuccess)
                .catch(handleError);
        function handleSuccess (response){
          return response.data;
        }
        function handleError (error) {
          return error;
        }
      }
      /**
       * Creates a mail correspondence.
       * @param  {[type]} mail [description]
       * @return {[type]}      [description]
       */
      function createMail(mail){
        if(mail.file_title === '' || mail.file_title == null)
						mail.file_title = 'none'

				if(mail.mail_type === 'other')
					mail.mail_type = mail.other_type

				if(mail.mail_type === 'cabinet_sub')
						mail.mail_type = 'cabinet sub'
        if(mail.follow_up_date == null){
            mail.follow_up_date = new Date(0)
        }

         mail.created_by = loginService.getUserId();
         mail.dept_id = loginService.getDepartmentId();

         var url = API_URLS.base_url + 'mails';
         return $http
                  .post(url, mail)
                  .then(handleSuccess)
                  .catch(handleError);
        function handleSuccess(response) {
            return response
        }

        function handleError(error) {
           return error
        }
      }
      
      function customDate( offset ){
        var date = new Date()
        date.setDate(date.getDate() + offset)
        return date
      }
      /**
       * Initializes an empty mail correspondence object
       * @return {[type]} [description]
       */
      function initMail(){
        return {
          mail_type: "letter",
  				sender: "",
  				receipent : "",
  				from_org: "",
  				subject: "",
          receipt_date: new Date(),
          file_title: '',
          follow_up: "1"
        }
      }
      /**
       * Get a mail correspondence by id.
       * @param  {[type]} id Id of a mail correspondence
       * @return {[type]}    [description]
       */
      function getMail (id) {
        var url = API_URLS.base_url + 'mails/' + id;
        return $http
                .get(url)
                .then(handleSuccess)
                .catch(handleError);
        function handleSuccess (response){
          return response.data;
        }
        function handleError (error) {
          return error;
        }
      }

      function getMailsByDepartmentId() {
        var dept_id = loginService.getDepartmentId(),
            url = API_URLS.base_url + 'mails/departments/' + dept_id
        return $http
                .get(url)
                .then(handleSuccess)
                .catch(handleError);
        function handleSuccess (response){
          return response.data.mails;
        }
        function handleError (error) {
          return error;
        }
      }
      /**
       * Create a mail correspondence action
       * @param  {[type]} mail [description]
       * @return {[type]}      [description]
       */
      function createAction(mail) {
        var url = API_URLS.base_url + 'mails/' + mail.mail_id + '/actions'
        return $http
                  .post(url, mail)
                  .then(handleSuccess)
                  .catch(handleError);

        function handleSuccess(response) {
          return response.data
        }
        function handleError(error) {
          return error
        }
      }
      /**
       * Get all actions for a given mail correspondence by id
       * @param  {[type]} mail_id [description]
       * @return {[type]}         [description]
       */
      function getActions(mail_id){
        var url = API_URLS.base_url + 'mails/' + mail_id + '/actions'
        return $http
                  .get(url)
                  .then(handleSuccess)
                  .catch(handleError);

        function handleSuccess (response){
          return response.data
        }

        function handleError (error) {
          return error
        }
      }
      /**
       * Get file attachments by mail correspondence id.
       * @param  {[type]} id Mail correspondence id.
       * @return {[type]}    [description]
       */
      function getAttachments ( id ) {
          var url = API_URLS.base_url + 'mails/' + id + '/attachments'
          return $http
                  .get(url)
                  .then(handleSuccess)
                  .catch(handleError);

          function handleSuccess( response ) {
            return response.data
          }

          function handleError ( error ) {
            return error
          }
      }
      /**
       * [updateMail description]
       * @param  {[type]} mail [description]
       * @return {[type]}      [description]
       */
      function updateMail( mail ) {
        var url = API_URLS.base_url + 'mails/' + mail.id
        mail.created_by = loginService.getUserId()
        mail.uname = loginService.getUserName()
        return $http
                .put(url, mail)
                .then(handleSuccess)
                .catch(handleError);

        function handleSuccess( response ) {
          return response.data
        }

        function handleError ( error ) {
          return error
        }
      }
      /**
       * Updates a field of a mail correspondence
       * @param  {[type]} field [description]
       * @param  {[type]} data  [description]
       * @return {[type]}       [description]
       */
      function update( key, value, id ) {
        var url = API_URLS.base_url + 'mails/' + id,
            update = { 'key': key,
                       'value': value,
                       'uname': loginService.getUserName(),
                       'created_by': loginService.getUserId()
                     }

        return $http.put( url, update )
                    .then(handleSuccess)
                    .catch(handleError)

        function handleSuccess( response ) {
          return response.data
        }

        function handleError ( error ) {
          return error
        }
      }

      function followUp( flag, id) {
        var url = API_URLS.base_url + 'mails/' + id,
            update = {
              created_by : loginService.getUserId(),
              uname : loginService.getUserName(),
              follow_up: flag
            }
        // if(flag) update.follow_up = 2
        // else update.follow_up = 1

        return $http
                .put(url, update)
                .then(handleSuccess)
                .catch(handleError);

        function handleSuccess( response ) {
          return response.data
        }

        function handleError ( error ) {
          return error
        }
      }

      return service;
    }
})();
