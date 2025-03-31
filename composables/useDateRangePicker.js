import { ref } from "vue";

export function useDateRangePicker() {
  const startDate = ref('');
  const endDate = ref('');

  const initializeDateRangePicker = (startInputId, endInputId) => {
    const $ = window.jQuery;

    // 시작일 선택 초기화
    $('#startDateInput').daterangepicker({
      singleDatePicker: true,
      autoUpdateInput: false,
      locale: {
        format: 'YYYY-MM-DD',
        cancelLabel: 'Clear'
      }
    }, (start) => {
      startDate.value = start.format('YYYY-MM-DD');
    });

    // 종료일 선택 초기화
    $('#endDateInput').daterangepicker({
      singleDatePicker: true,
      autoUpdateInput: false,
      locale: {
        format: 'YYYY-MM-DD',
        cancelLabel: 'Clear'
      }
    }, (end) => {
      endDate.value = end.format('YYYY-MM-DD');
    });

    // 날짜 선택 취소 시 입력 필드 초기화
    $('#startDateInput, #endDateInput').on('cancel.daterangepicker', function () {
      $(this).val('');
      if(this.id === startInputId) startDate.value = '';
      if(this.id === endInputId) endDate.value = '';
    });
  };

  return {
    startDate,
    endDate,
    initializeDateRangePicker
  }
}