import { SOURCE_URL } from "../data/content";

/*
 * The source site's footer uses non-breaking spaces as its own layout
 * scaffolding. They are preserved here because they affect the rendered
 * column rhythm and wrapping of the original page.
 */
const footerMarkup = `
&nbsp; <div class="container">
&nbsp; &nbsp; <div class="row">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="col-md-3">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <h5>Company</h5>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="desc">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <p>BOGO Beverages Limited, 21, Sanusi Fafunwa Street, VI, Lagos 106104</p>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="col-md-3">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <h5>Career</h5>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="desc">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <p>Work with us <a href="${SOURCE_URL}/career">Click here</a>&nbsp;to explore and apply for open roles</p>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="col-md-3">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <h5>Links</h5>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <ul>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <li><a href="${SOURCE_URL}">Privacy Policy</a></li>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <li><a href="${SOURCE_URL}">Cookie Policy</a></li>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <li><a href="${SOURCE_URL}">Site Map</a></li>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <li><a href="${SOURCE_URL}">Downloads</a></li>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </ul>
&nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="col-md-3">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <h5>Connect with us</h5>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="d-flex footer-social mb-5 flex-wrap">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a target="_blank" rel="noreferrer" aria-label="Facebook" href="https://web.facebook.com/"><img src="/images/fb.svg" alt="" class="img-fluid"></a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a target="_blank" rel="noreferrer" aria-label="Twitter" href="https://twitter.com/"><img src="/images/logo-twitter.svg" alt="" class="img-fluid"></a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a target="_blank" rel="noreferrer" aria-label="Instagram" href="https://www.instagram.com/bogobeverages/"><img src="/images/logo-instagram.svg" alt="" class="img-fluid"></a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <div class="d-flex footer-social flex-wrap">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a target="_blank" rel="noreferrer" aria-label="LinkedIn" href="https://www.linkedin.com/company/bogobeverages/"><img src="/images/logo-linkedin.svg" alt="" class="img-fluid"></a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a target="_blank" rel="noreferrer" aria-label="YouTube" href="https://www.youtube.com/@BogoBeverages"><img src="/images/youtube.svg" alt="" class="img-fluid"></a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; &nbsp; </div>
&nbsp; &nbsp; &nbsp; 
&nbsp; &nbsp; </div> 
&nbsp; </div> 
`;

export default function Footer() {
  return (
    <footer
      className="footer"
      dangerouslySetInnerHTML={{ __html: footerMarkup }}
    />
  );
}
