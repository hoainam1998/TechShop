let danhmuc = new URLSearchParams(location.search).get('danhmuc');
if(danhmuc===null){
    danhmuc='smartphone'
}
new Event_dashboard(danhmuc);
new Controller(new Model(danhmuc), new View())
