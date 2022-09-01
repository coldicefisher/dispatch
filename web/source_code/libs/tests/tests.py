from libs.tests.test_delete import delete_data
from libs.tests.test_user_and_profile_creation import test_user_and_profile_creation
from libs.tests.test_profile_functionality import test_profile_functionality
from libs.tests.test_profile_association import test_profile_association
from libs.tests.test_business_functionality import test_business_functionality

import time

def run_tests():
    start_time_main = time.time()

    # print ('DELETING DATA //////////////////////////////////////////////////////////////////')
    # print ('////////////////////////////////////////////////////////////////////////////////')
    # print ('')
    # print ('')
    # delete_data()
    # print ('')
    # print ('')
    
    # print ('TESTING BASIC USER AND PROFILE CREATION ////////////////////////////////////////')
    # print ('////////////////////////////////////////////////////////////////////////////////')
    # print ('')
    # print ('')
    # test_user_and_profile_creation()
    # print ('')
    # print ('')
    
    # print ('DELETING DATA //////////////////////////////////////////////////////////////////')
    # print ('////////////////////////////////////////////////////////////////////////////////')
    # print ('')
    # print ('')
    # delete_data()
    # print ('')
    # print ('')
    
    # print ('TESTING PROFILE FUNCTIONALITY //////////////////////////////////////////////////')
    # print ('////////////////////////////////////////////////////////////////////////////////')
    # print ('')
    # print ('')
    # test_profile_functionality()
    # print ('')
    # print ('')
    
    # print ('DELETING DATA //////////////////////////////////////////////////////////////////')
    # print ('////////////////////////////////////////////////////////////////////////////////')
    # print ('')
    # print ('')
    # delete_data()
    # print ('')
    # print ('')
    
    # print ('TESTING CREATING UNASSOCIATED PROFILE CREATION AND ASSOCIATION /////////////////')
    # print ('////////////////////////////////////////////////////////////////////////////////')
    # print ('')
    # print ('')
    # test_profile_association()
    # print ('')
    # print ('')
    
    print ('DELETING DATA //////////////////////////////////////////////////////////////////')
    print ('////////////////////////////////////////////////////////////////////////////////')
    print ('')
    print ('')
    delete_data()
    print ('')
    print ('')
    
    print ('TESTING BUSINESS FUNCITONALITY /////////////////////////////////////////////////')
    print ('////////////////////////////////////////////////////////////////////////////////')
    test_business_functionality()
    print ('')
    print ('')

    print (f'All tests took {time.time() - start_time_main} seconds...')
    print ('')
    print ('')
    print ('')
    print ('')
    print('///////////                 ///      ///////////////////////////////////')
    print('//        ///////           ///                                    ///')
    print('//             /////        ///                                  ///')
    print('//               ////       ///                                ///')
    print('//                 ///      ///                              ///')
    print('//                ///       ///                            ///')
    print('//            ////          ///                          ///')
    print('//       /////              ///                        ///')
    print('/////////                   ///                      ///')
    print('//       /////              ///                    ///')
    print('//            ////          ///                  ///')
    print('//                ///       ///                ///')
    print('//                 ///      ///              ///')
    print('//               ////       ///            ///')
    print('//             /////        ///          ///')
    print('//        ///////           ///        ///')
    print('///////////                 ///      ////////////////////////////////////')

