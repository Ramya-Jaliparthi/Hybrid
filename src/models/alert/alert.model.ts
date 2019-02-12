
export class AlertModel {
  id: string;
  title: string;
  message: string;
  type: string = "info";
  alertFromServer: boolean = false;
  showAlert: boolean = false;
  RowNum: string;
  hideCloseButton: boolean = false;
}
