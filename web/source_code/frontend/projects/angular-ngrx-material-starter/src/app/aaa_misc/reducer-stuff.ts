
// on(actionProcessCreateBusinessForm1, (state, action) => {
//   return produce(state, draftState => {
//     try {
//       if (draftState.createForm.some(x => x.id === 'createForm') === false) {
//         draftState.forms.push({
//           id: 'createForm', 
//           item: {
//             name: action.name,
//             page: action.page,
//             previousPage: action.previousPage,
//             legalStructure: action.legalStructure,
//             industry: action.industry,
//             industryCategory: action.industryCategory,
//             }
//           })
//       }
//       else {
//         draftState.forms[draftState.forms.findIndex(x => x.id == `createForm`)].item.name = action.name;
//         draftState.forms[draftState.forms.findIndex(x => x.id == `createForm`)].item.previousPage = action.previousPage;
//         draftState.forms[draftState.forms.findIndex(x => x.id == `createForm`)].item.page = action.page;
//         draftState.forms[draftState.forms.findIndex(x => x.id == `createForm`)].item.legalStructure = action.legalStructure;
//         draftState.forms[draftState.forms.findIndex(x => x.id == `createForm`)].item.industry = action.industry;
//         draftState.forms[draftState.forms.findIndex(x => x.id == `createForm`)].item.industry = action.industryCategory;
//       } 
//     }    
//       catch(e) {
//         console.log(e);
//       }
//       finally {
//         return draftState;
//       }
//   })
// }),

// );
